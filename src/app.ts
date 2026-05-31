import express, { Request, Response } from 'express';
import turnoRoutes from './routes/turnoRoutes';
import { sseHandler } from './utils/sseHandler';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', turnoRoutes);

// SSE endpoint para eventos en tiempo real
app.get('/api/events', sseHandler);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
