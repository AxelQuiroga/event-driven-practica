import { z } from 'zod';

// 1. Definimos el contrato de validación con Zod
// Ahora acepta IDs en lugar de strings - arquitectura relacional correcta
export const createTurnoSchema = z.object({
  cliente_id: z
    .number()
    .int('El ID del cliente debe ser un entero')
    .positive('El ID del cliente debe ser positivo'),
    
  servicio_id: z
    .number()
    .int('El ID del servicio debe ser un entero')
    .positive('El ID del servicio debe ser positivo'),
    
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato AAAA-MM-DD'),
    
  hora: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'La hora debe tener el formato HH:MM'),
    
  estado: z
    .enum(['pending', 'completed', 'cancelled'])
    .default('pending'),
    
  notas: z
    .string()
    .nullable(),
});

// 2. ÉLITE: Inferimos el tipo de TS directamente del esquema de Zod.
// Chau interfaces duplicadas a mano. Si cambia el esquema, cambia el tipo solo.
export type CreateTurnoDTO = z.infer<typeof createTurnoSchema>;