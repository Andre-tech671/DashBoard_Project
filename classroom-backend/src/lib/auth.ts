import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
import * as schema from "../db/schema";


export const auth = betterAuth({
    secret: process.env.Better_AUTH_SECRET!,
    baseURL: process.env.BACKEND_URL || "http://localhost:8000",
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,
    }),

    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: true,
                defaultValue: 'student',
                input: true,
            },
             imageCldPubId: {
                type: 'string',
                required: false,
                input: true,
            }
        }
    }
});
