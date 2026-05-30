import app from './app';
import './utils/eventLogger'; // Importar para inicializar el logger de eventos

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});