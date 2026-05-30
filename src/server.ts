import app from './app';
import './utils/eventLogger'; // Importar para inicializar el logger de eventos
import { initDB } from './config/database';

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  await initDB();
});