import dotenv from 'dotenv';
dotenv.config(); // Cargar .env ANTES que cualquier otra cosa

import app from './app';
import './utils/eventLogger'; // Importar para inicializar el logger de eventos
import { initSSE } from './utils/sseHandler';
import { initDB } from './config/database';

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  // Inicializar SSE después de que el servidor arranque
  initSSE();

  await initDB();
});