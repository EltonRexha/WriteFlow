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

export interface DraftDetail {
    id: string;
    name: string;
    BlogContent: {
        content: unknown;
    };
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

export async function getDraft(
    draftId: string
): Promise<ResponseError | DraftDetail> {
    try {
        const res = await axios.get<ResponseError | DraftDetail>('/drafts', {
            params: { id: draftId },
        });
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function updateDraft(
    draftId: string,
    content: string
): Promise<ResponseError | { message: string; code: number }> {
    try {
        const res = await axios.put<ResponseError | { message: string; code: number }>(
            '/drafts',
            { id: draftId, content }
        );
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function publishDraft(
    draftId: string,
    blogData: {
        title: string;
        description: string;
        imageUrl: string;
        categories: string[];
    }
): Promise<ResponseError | string | ZodError> {
    try {
        const res = await axios.post<ResponseError | string | ZodError>(
            `/drafts/${draftId}/publish`,
            blogData
        );
        return res.data;
    } catch (err) {
        console.log(err);
        if (isResponseError(err)) return err;
        throw err;
    }
}
