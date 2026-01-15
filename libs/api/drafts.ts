import axios from '@/config/axios';
import { DraftSchema } from '@/schemas/draftSchema';
import { isResponseError } from '@/types/guards/isResponseError';
import { ResponseError } from '@/types/ResponseError';
import { z, ZodError } from 'zod';

type CreateDraftPayload = z.infer<typeof DraftSchema>;

export interface DraftDto {
    id: string;
    name: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface DraftPagination {
    drafts: DraftDto[];
    pagination: {
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        totalCount: number;
    };
}

export async function getDrafts(
    page: number = 1,
    limit: number = 10
): Promise<ResponseError | DraftPagination> {
    try {
        const res = await axios.get<ResponseError | DraftPagination>('/drafts', {
            params: { page, limit },
        });
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function createDraft(
    data: CreateDraftPayload
): Promise<ResponseError | string | ZodError> {
    try {
        const parsed = DraftSchema.parse(data);
        const res = await axios.post<ResponseError | string | ZodError>('/drafts', parsed);
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function deleteDraft(
    draftId: string
): Promise<ResponseError | { message: string }> {
    try {
        const res = await axios.delete<ResponseError | { message: string }>('/drafts', {
            params: { id: draftId },
        });
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}
