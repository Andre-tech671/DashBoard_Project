// --- Database connection ---
import { db } from '../db';

// --- Drizzle ORM utilities ---
// and, or → logical operators for combining conditions
// eq → equality comparison
// ilike → case-insensitive LIKE operator
// sql → raw SQL fragments
// desc → descending order for sorting
// getTableColumns → helper to select all columns from a table
import { and, eq, getTableColumns, ilike, or, sql, desc } from 'drizzle-orm';

// --- Database schema definitions ---
// subjects → table schema for subjects
// departments → table schema for departments
import { departments, subjects } from "../db/schema";

// --- Express framework ---
import express from 'express';

const router = express.Router();

/**
 * GET /subjects
 * Fetch all subjects with optional search, department filtering, and pagination
 */
router.get('/', async (req, res) => {
    try {
        // --- Extract query parameters ---
        const { search, department, page = 1, limit = 10 } = req.query;

        // --- Pagination setup ---
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);         // Ensure page is at least 1
        const limitPerPage = Math.max(1, parseInt(String(limit), 10) || 100); // Ensure limit is at least 1, default to 100 if not provided
                     // Ensure limit is at least 1
        const offset = (currentPage - 1) * limitPerPage;

    

        // --- Build filter conditions ---
        const filterConditions = [];

        // Search filter: match subject name OR subject code
        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            );
        }

        // Department filter: match department name
        if (department) {
            filterConditions.push(ilike(departments.name, `%${department}%`));
            const deptPattern = `${String(department).replace(/[%_]/g, '\\$&')}%`; // Escape % and _ for SQL LIKE
            filterConditions.push(ilike(departments.name, deptPattern));
        }

        // Combine filters with AND, or leave undefined if no filters
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        // --- Count total records for pagination ---
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause);

        const totalCount = countResult[0]?.count || 0;

        // --- Fetch paginated subject list ---
        const subjectsList = await db
            .select({
                ...getTableColumns(subjects),
                department: { ...getTableColumns(departments) }
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        // --- Send response ---
        res.status(200).json({
            data: subjectsList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage)
            }
        });
    } catch (error) {
        console.error(`Get subjects error: ${error}`);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

export default router;