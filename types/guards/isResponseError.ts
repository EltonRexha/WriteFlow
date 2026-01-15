import { ResponseError } from "../ResponseError";

export function isResponseError(obj: unknown): obj is ResponseError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'error' in obj &&
        typeof (obj as ResponseError).error === 'object' &&
        (obj as ResponseError).error !== null &&
        typeof (obj as ResponseError).error.message === 'string' &&
        typeof (obj as ResponseError).error.code === 'number'
    );
}