export interface ActionError {
    error: {
        message: string,
        code: number
    }
}

export function isActionError(value: unknown): value is ActionError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'object' &&
    value.error !== null &&
    'message' in value.error &&
    typeof value.error.message === 'string' &&
    'code' in value.error &&
    typeof value.error.code === 'number'
  );
}