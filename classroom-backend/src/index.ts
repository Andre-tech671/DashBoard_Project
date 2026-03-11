import AgentAPI from 'apminsight';
AgentAPI.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import subjectsRouter from './routes/subjects';
import securityMiddleware from './middleware/security';
import usersRouter from './routes/users';
import classesRouter from './routes/classes';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Allow multiple origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://magementdashboard.netlify.app", // deployed frontend
  process.env.FRONTEND_URL // optional dynamic value
].filter(Boolean); // remove undefined/null

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

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

// Routes
app.use('/api/subjects', subjectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);

// Security middleware
app.use(securityMiddleware);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🌐 Backend URL: ${process.env.BACKEND_URL || 'http://localhost:8000'}`);
  console.log(`🎯 Allowed Origins: ${allowedOrigins.join(", ")}`);
});