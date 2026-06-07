/**
 * Representa un servicio del catálogo de la peluquería.
 *
 * Solo nombre y precio. El barbero maneja sus tiempos,
 * nosotros no trackeamos duración.
 */
export interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
  created_at?: string;
}
