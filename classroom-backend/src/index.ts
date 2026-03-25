import AgentAPI from 'apminsight';
AgentAPI.config();

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import subjectsRouter from './routes/subjects';
import usersRouter from './routes/users';
import classesRouter from './routes/classes';
import departmentsRouter from './routes/departments';
import statsRouter from './routes/stats';
import enrollmentsRouter from './routes/enrollments';

// import securityMiddleware from './middleware/security';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Allow multiple origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:3000",   // React dev
  "http://localhost:5173",   // Vite dev
  "https://magementdashboard.netlify.app", // deployed frontend
  process.env.FRONTEND_URL   // optional dynamic value
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman/curl
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Auth route
app.all('/api/auth/*splat', toNodeHandler(auth));

// JSON middleware
app.use(express.json());

// Security middleware (apply globally)
// app.use(securityMiddleware); // Replaced with inline helmet config

// Using helmet for security headers.
// The CSP is configured to be permissive for development to allow tools like
// Refine Devtools which may use 'eval'. You should tighten this for production.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
      },
    },
  })
);

// Routes
app.use('/api/subjects', subjectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/enrollments', enrollmentsRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Backend server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🌐 Backend URL: ${process.env.BACKEND_URL || 'http://localhost:8000'}`);
  console.log(`🎯 Allowed Origins: ${allowedOrigins.join(", ")}`);
});