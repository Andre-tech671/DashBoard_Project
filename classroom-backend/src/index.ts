import express, { Request, Response } from 'express';

const app = express();
const PORT = 8000;

// JSON middleware
app.use(express.json());

// GET route that returns a short message
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
