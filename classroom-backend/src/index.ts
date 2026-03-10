import AgentAPI from 'apminsight';
AgentAPI.config();


import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import subjectsRouter from './routes/subjects';
import securityMiddleware from './middleware/security';
import usersRouter from './routes/users';
import classesRouter from './routes/classes';
import {toNodeHandler} from "better-auth/node";
import {auth} from "./lib/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL is not defined in environment variables');
}
// Load environment variables from .env file
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://magementdashboard.netlify.app/', // Allow requests from the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies and credentials
}));

app.all('/api/auth/*splat', toNodeHandler(auth));

// JSON middleware
app.use(express.json());

// Routes
app.use('/api/subjects', subjectsRouter);

app.use("/api/users", usersRouter);

app.use('/api/classes', classesRouter);

// Security middleware
app.use(securityMiddleware);

// GET route that returns a short message
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Backend URL: ${process.env.BACKEND_URL || 'http://localhost:8000'}`);
});
