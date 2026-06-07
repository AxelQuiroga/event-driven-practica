/**
 * Cliente real de la peluquería.
 *
 * Nombre + teléfono son lo mínimo para identificar al cliente.
 * Email y notas son opcionales.
 */
export interface Cliente {
  id: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  notas: string | null;
  created_at?: string;
  updated_at?: string;
}
