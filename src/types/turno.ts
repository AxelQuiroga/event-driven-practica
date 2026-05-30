export interface Turno {
  id: number;
  nombre: string;
  servicio: string;
  fecha: string; // ISO date string
  hora: string;  // Time string
  created_at?: string;
}