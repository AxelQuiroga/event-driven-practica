import express, { Request, Response } from 'express';
import turnoRoutes from './routes/turnoRoutes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', turnoRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
