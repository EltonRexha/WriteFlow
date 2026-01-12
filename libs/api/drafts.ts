import axios from '@/config/axios';
import { DraftSchema } from '@/schemas/draftSchema';
import type { ActionError } from '@/types/ActionError';
import { z, ZodError } from 'zod';

type Draft = z.infer<typeof DraftSchema>;

export async function createDraft(
    payload: Draft
): Promise<ActionError | string | ZodError> {
    try {
        const parsed = DraftSchema.parse(payload);
        const res = await axios.post<ActionError | string | ZodError>('/drafts', parsed);
        return res.data;
    } catch (err) {
        const data = (err as any)?.response?.data;
        if (data) return data as ActionError | ZodError;
        throw err;
    }
}
