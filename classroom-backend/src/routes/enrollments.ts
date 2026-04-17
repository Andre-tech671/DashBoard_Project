import express from "express";
import { and, eq, getTableColumns, sql } from "drizzle-orm";

import { db } from "../db/index.js";
import { classes, departments, enrollments, subjects, user } from "../db/schema/index.js";

const router = express.Router();

const getEnrollmentDetails = async (enrollmentId: number) => {
  const [enrollment] = await db
    .select({
      ...getTableColumns(enrollments),
      class: {
        ...getTableColumns(classes),
      },
      subject: {
        ...getTableColumns(subjects),
      },
      department: {
        ...getTableColumns(departments),
      },
      teacher: {
        ...getTableColumns(user),
      },
    })
    .from(enrollments)
    .leftJoin(classes, eq(enrollments.classId, classes.id))
    .leftJoin(subjects, eq(classes.subjectId, subjects.id))
    .leftJoin(departments, eq(subjects.departmentId, departments.id))
    .leftJoin(user, eq(classes.teacherId, user.id))
    .where(eq(enrollments.id, enrollmentId));

  return enrollment;
};

// List enrollments (Admin sees all, Student sees own)
router.get("/", async (req, res) => {
  try {
    // @ts-ignore
    const requester = req.user;
    const filterConditions = [];

    if (requester?.role === "student") {
      filterConditions.push(eq(enrollments.studentId, requester.id));
    }

    const list = await db
      .select({
        ...getTableColumns(enrollments),
        student: { name: user.name, email: user.email },
        class: { name: classes.name }
      })
      .from(enrollments)
      .leftJoin(user, eq(enrollments.studentId, user.id))
      .leftJoin(classes, eq(enrollments.classId, classes.id))
      .where(filterConditions.length > 0 ? and(...filterConditions) : undefined)
      .orderBy(desc(enrollments.createdAt));

    res.status(200).json({ data: list });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const [updated] = await db
      .update(enrollments)
      .set({ status: req.body.status, updatedAt: new Date() })
      .where(eq(enrollments.id, Number(req.params.id)))
      .returning();
    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update enrollment" });
  }
});

// Create enrollment
router.post("/", async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    if (!classId || !studentId) {
      return res
        .status(400)
        .json({ error: "classId and studentId are required" });
    }

    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!classRecord) return res.status(404).json({ error: "Class not found" });

    // Check capacity
    const [currentEnrollmentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.classId, classId));

    if ((currentEnrollmentCount?.count ?? 0) >= classRecord.capacity) {
      return res.status(400).json({ error: "Class is at full capacity" });
    }

    const [student] = await db
      .select()
      .from(user)
      .where(eq(user.id, studentId));

    if (!student) return res.status(404).json({ error: "Student not found" });

    const [existingEnrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.classId, classId),
          eq(enrollments.studentId, studentId)
        )
      );

    if (existingEnrollment)
      return res
        .status(409)
        .json({ error: "Student already enrolled in class" });

    const [createdEnrollment] = await db
      .insert(enrollments)
      .values({ classId, studentId })
      .returning({ id: enrollments.id });

    if (!createdEnrollment)
      return res.status(500).json({ error: "Failed to create enrollment" });

    const enrollment = await getEnrollmentDetails(createdEnrollment.id);

    res.status(201).json({ data: enrollment });
  } catch (error) {
    console.error("POST /enrollments error:", error);
    res.status(500).json({ error: "Failed to create enrollment" });
  }
});

// Join class by invite code
router.post("/join", async (req, res) => {
  try {
    const { inviteCode, studentId } = req.body;

    if (!inviteCode || !studentId) {
      return res
        .status(400)
        .json({ error: "inviteCode and studentId are required" });
    }

    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.inviteCode, inviteCode));

    if (!classRecord) return res.status(404).json({ error: "Class not found" });

    // Check capacity before allowing join via invite code
    const [currentEnrollmentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.classId, classRecord.id));

    if ((currentEnrollmentCount?.count ?? 0) >= classRecord.capacity) {
      return res.status(400).json({ error: "Class is at full capacity" });
    }

    const [student] = await db
      .select()
      .from(user)
      .where(eq(user.id, studentId));

    if (!student) return res.status(404).json({ error: "Student not found" });

    const [existingEnrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.classId, classRecord.id),
          eq(enrollments.studentId, studentId)
        )
      );

    if (existingEnrollment)
      return res
        .status(409)
        .json({ error: "Student already enrolled in class" });

    const [createdEnrollment] = await db
      .insert(enrollments)
      .values({ classId: classRecord.id, studentId })
      .returning({ id: enrollments.id });

    if (!createdEnrollment)
      return res.status(500).json({ error: "Failed to join class" });

    const enrollment = await getEnrollmentDetails(createdEnrollment.id);

    res.status(201).json({ data: enrollment });
  } catch (error) {
    console.error("POST /enrollments/join error:", error);
    res.status(500).json({ error: "Failed to join class" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(enrollments).where(eq(enrollments.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    console.error("DELETE /enrollments/:id error:", error);
    res.status(500).json({ error: "Failed to unenroll" });
  }
});

export default router;