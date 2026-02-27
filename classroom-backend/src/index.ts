import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import subjectsRouter from './routes/subjects';

const app = express();
const PORT = 8000;

dotenv.config();

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL is not defined in environment variables');
}
// Load environment variables from .env file
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow requests from the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies and credentials
}))

// JSON middleware
app.use(express.json());

app.use('/api/subjects', subjectsRouter);

// GET route that returns a short message
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
