import { EventBus } from './eventBus';

// Logger que se suscribe automáticamente a los eventos del sistema
export class EventLogger {
  private static instance: EventLogger;

  private constructor() {
    // Suscribirse a eventos al crear la instancia
    this.subscribeToEvents();
  }

  static getInstance(): EventLogger {
    if (!EventLogger.instance) {
      EventLogger.instance = new EventLogger();
    }
    return EventLogger.instance;
  }

  private subscribeToEvents(): void {
    const eventBus = EventBus.getInstance();
    
    // Suscribirse al evento de turno creado
    eventBus.subscribe('turnoCreado', (turno) => {
      console.log(`[EVENTO] Turno creado: ${turno.nombre} - ${turno.servicio} el ${turno.fecha} a las ${turno.hora}`);
    });
    
    // Suscribirse al evento de turno eliminado
    eventBus.subscribe('turnoEliminado', (data) => {
      console.log(`[EVENTO] Turno eliminado con ID: ${data.id}`);
    });
  }
}

// Inicializar el logger al cargar el módulo
// Esto asegura que las suscripciones se establezcan inmediatamente
EventLogger.getInstance();