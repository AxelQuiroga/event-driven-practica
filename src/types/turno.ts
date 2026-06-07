/**
 * Turno de la peluquería.
 *
 * - cliente_id: FK a clientes (el cliente real, no un string)
 * - servicio_id: FK a servicios (catálogo)
 * - hora: siempre :00 o :30 (validado en DB y schema)
 * - estado: pending | completed | cancelled
 * - notas: opcional — "quiere con Maxi", etc.
 */

export type TurnoEstado = 'pending' | 'completed' | 'cancelled';

export interface Turno {
  id: number;
  cliente_id: number;
  servicio_id: number;
  fecha: string;          // ISO date: "2026-06-06"
  hora: string;           // "09:00", "09:30", "10:00", etc.
  estado: TurnoEstado;
  notas: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * DTO para crear un turno - sin id ni timestamps (los setea la DB)
 */
export interface CreateTurnoInput {
  cliente_id: number;
  servicio_id: number;
  fecha: string;
  hora: string;
  estado: TurnoEstado;
  notas: string | null;
}

/**
 * Turno con datos joinados para mostrar en frontend.
 * Incluye nombre del cliente y nombre del servicio.
 */
export interface TurnoConDetalles extends Turno {
  cliente_nombre: string;
  servicio_nombre: string;
  servicio_precio: number;
}

/**
 * DTO para crear un turno (lo que llega del frontend).
 */
export interface CrearTurnoDTO {
  cliente_id: number;
  servicio_id: number;
  fecha: string;
  hora: string;
  notas?: string;
}

/**
 * DTO para editar un turno (campos opcionales).
 */
export interface EditarTurnoDTO {
  cliente_id?: number;
  servicio_id?: number;
  fecha?: string;
  hora?: string;
  notas?: string;
}
