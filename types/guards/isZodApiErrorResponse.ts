import { ZodError } from 'zod';

function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

export default isZodError;