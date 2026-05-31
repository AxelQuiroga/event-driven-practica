import { Request, Response } from 'express';
import { EventBus } from './eventBus';

// Set of connected SSE clients (browsers waiting for events)
const clients = new Set<Response>();

/**
 * Express handler for GET /api/events
 * Mantiene la conexión abierta y envía eventos cuando ocurren
 */
export function sseHandler(req: Request, res: Response): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  // Enviar evento de conexión inicial
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  clients.add(res);
  console.log(`[SSE] Cliente conectado. Total: ${clients.size}`);

  // Cleanup al desconectarse
  req.on('close', () => {
    clients.delete(res);
    console.log(`[SSE] Cliente desconectado. Total: ${clients.size}`);
  });
}

/**
 * Inicializa la suscripción al EventBus para broadcast a todos los clientes SSE
 */
export function initSSE(): void {
  const eventBus = EventBus.getInstance();

  eventBus.subscribe('turnoCreado', (data) => {
    broadcast({ type: 'turnoCreado', data });
  });

  eventBus.subscribe('turnoEliminado', (data) => {
    broadcast({ type: 'turnoEliminado', data });
  });

  console.log('[SSE] Suscripciones al EventBus iniciadas');
}

function broadcast(event: { type: string; data: unknown }): void {
  const message = `data: ${JSON.stringify(event)}\n\n`;
  clients.forEach((client) => {
    client.write(message);
  });
}
