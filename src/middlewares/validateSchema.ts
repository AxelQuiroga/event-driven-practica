import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateSchema = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // .parse() analiza el req.body. Si todo está ok, muta o valida los datos.
      // Si algo está mal, salta directo al catch.
      schema.parse(req.body);
      
      // Si pasó la validación, le damos paso al Controlador
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Mapeamos los errores de Zod para que el Frontend reciba un JSON limpio y descriptivo
        const errorMessages = error.issues.map((err) => ({
          campo: err.path.join('.'),
          mensaje: err.message,
        }));

        res.status(400).json({
          status: 'fail',
          errors: errorMessages,
        });
        return;
      }

      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };
};