import { z } from 'zod';

// 1. Definimos el contrato de validación con Zod
export const createTurnoSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
    
  servicio: z
    .string()
    .min(3, 'El servicio no es válido'),
    
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato AAAA-MM-DD'),
    
  hora: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'La hora debe tener el formato HH:MM'),
});

// 2. ÉLITE: Inferimos el tipo de TS directamente del esquema de Zod.
// Chau interfaces duplicadas a mano. Si cambia el esquema, cambia el tipo solo.
export type CreateTurnoDTO = z.infer<typeof createTurnoSchema>;