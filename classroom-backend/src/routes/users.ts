import express from "express";
import { and, desc, eq, ilike, or, sql, getTableColumns } from "drizzle-orm";

import { db } from "../db/index.js";
import { classes, departments, enrollments, subjects, user, type UserRoles } from "../db/schema/index.js";

const router = express.Router();

// Get all users with optional search, role filter, and pagination
router.get("/", async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, Number(page));
    const limitPerPage = Math.max(1, Number(limit));
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
      );
    }

    if (role) {
      filterConditions.push(eq(user.role, role as UserRoles));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(whereClause);

    const totalCount = Number(countResult[0]?.count ?? 0);

    const usersList = await db
      .select()
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: usersList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Permission Check: Admin only
    // @ts-ignore
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Only admins can create users" });
    }

    const { name, email, password, role, status } = req.body;
    const [createdUser] = await db
      .insert(user)
      .values({ name, email, role, status })
      .returning();
    res.status(201).json({ data: createdUser });
  } catch (error) {
    console.error("POST /users error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    // Permission Check: Admin only or self-update (simplified to admin for now)
    // @ts-ignore
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { name, role, status } = req.body;
    const [updatedUser] = await db
      .update(user)
      .set({ name, role, status, updatedAt: new Date() })
      .where(eq(user.id, req.params.id))
      .returning();

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error("PATCH /users/:id error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Get user details with role-specific data
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ data: userRecord });
  } catch (error) {
    console.error("GET /users/:id error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// List departments associated with a user
router.get("/:id/departments", async (req, res) => {
  try {
    const userId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const [userRecord] = await db
      .select({ id: user.id, role: user.role })
      .from(user)
      .where(eq(user.id, userId));

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentPage = Math.max(1, Number(page));
    const limitPerPage = Math.max(1, Number(limit));
    const offset = (currentPage - 1) * limitPerPage;

    let countResult;
    if (userRecord.role === "teacher") {
      countResult = await db
            .select({ count: sql<number>`count(distinct ${departments.id})` })
            .from(departments)
            .innerJoin(subjects, eq(subjects.departmentId, departments.id))
            .innerJoin(classes, eq(classes.subjectId, subjects.id))
            .where(eq(classes.teacherId, userId));
    } else if (userRecord.role === "student") {
      countResult = await db
            .select({ count: sql<number>`count(distinct ${departments.id})` })
            .from(departments)
            .innerJoin(subjects, eq(subjects.departmentId, departments.id))
            .innerJoin(classes, eq(classes.subjectId, subjects.id))
            .innerJoin(enrollments, eq(enrollments.classId, classes.id))
            .where(eq(enrollments.studentId, userId));
    } else {
      countResult = await db.select({ count: sql<number>`count(*)` }).from(departments);
    }

    const totalCount = Number(countResult[0]?.count ?? 0);

    const departmentsList =
      userRecord.role === "teacher"
        ? await db
            .select({ ...getTableColumns(departments) })
            .from(departments)
            .leftJoin(subjects, eq(subjects.departmentId, departments.id))
            .leftJoin(classes, eq(classes.subjectId, subjects.id))
            .where(eq(classes.teacherId, userId))
            .groupBy(departments.id)
            .orderBy(desc(departments.createdAt))
            .limit(limitPerPage)
            .offset(offset)
        : userRecord.role === "student"
        ? await db
            .select({ ...getTableColumns(departments) })
            .from(departments)
            .leftJoin(subjects, eq(subjects.departmentId, departments.id))
            .leftJoin(classes, eq(classes.subjectId, subjects.id))
            .leftJoin(enrollments, eq(enrollments.classId, classes.id))
            .where(eq(enrollments.studentId, userId))
            .groupBy(departments.id)
            .orderBy(desc(departments.createdAt))
            .limit(limitPerPage)
            .offset(offset)
        : await db
            .select({ ...getTableColumns(departments) })
            .from(departments)
            .orderBy(desc(departments.createdAt))
            .limit(limitPerPage)
            .offset(offset);

    res.status(200).json({
      data: departmentsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /users/:id/departments error:", error);
    res.status(500).json({ error: "Failed to fetch user departments" });
  }
});

// List subjects associated with a user
router.get("/:id/subjects", async (req, res) => {
  try {
    const userId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const [userRecord] = await db
      .select({ id: user.id, role: user.role })
      .from(user)
      .where(eq(user.id, userId));

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentPage = Math.max(1, Number(page));
    const limitPerPage = Math.max(1, Number(limit));
    const offset = (currentPage - 1) * limitPerPage;

    let countResult;
    if (userRecord.role === "teacher") {
      countResult = await db
            .select({ count: sql<number>`count(distinct ${subjects.id})` })
            .from(subjects)
            .innerJoin(classes, eq(classes.subjectId, subjects.id))
            .where(eq(classes.teacherId, userId));
    } else if (userRecord.role === "student") {
      countResult = await db
            .select({ count: sql<number>`count(distinct ${subjects.id})` })
            .from(subjects)
            .innerJoin(classes, eq(classes.subjectId, subjects.id))
            .innerJoin(enrollments, eq(enrollments.classId, classes.id))
            .where(eq(enrollments.studentId, userId));
    } else {
      countResult = await db.select({ count: sql<number>`count(*)` }).from(subjects);
    }

    const totalCount = Number(countResult[0]?.count ?? 0);

    const subjectsList =
      userRecord.role === "teacher"
        ? await db
            .select({
              ...getTableColumns(subjects),
              department: {
                ...getTableColumns(departments),
              },
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .leftJoin(classes, eq(classes.subjectId, subjects.id))
            .where(eq(classes.teacherId, userId))
            .groupBy(subjects.id, departments.id)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset)
        : userRecord.role === "student"
        ? await db
            .select({
              ...getTableColumns(subjects),
              department: {
                ...getTableColumns(departments),
              },
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .leftJoin(classes, eq(classes.subjectId, subjects.id))
            .leftJoin(enrollments, eq(enrollments.classId, classes.id))
            .where(eq(enrollments.studentId, userId))
            .groupBy(subjects.id, departments.id)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset)
        : await db
            .select({
              ...getTableColumns(subjects),
              department: {
                ...getTableColumns(departments),
              },
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /users/:id/subjects error:", error);
    res.status(500).json({ error: "Failed to fetch user subjects" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // @ts-ignore
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.id, req.params.id))
      .returning();

    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(204).end();
  } catch (error) {
    console.error("DELETE /users/:id error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;