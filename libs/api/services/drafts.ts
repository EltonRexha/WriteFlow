import axios from '@/config/axios';
import { DraftSchema } from '@/schemas/draftSchema';
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

const draftApi = {
  getDrafts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseError | DraftPagination> => {
    const res = await axios.get<ResponseError | DraftPagination>('/drafts', {
        params: { page, limit },
    });
    return res.data;
  },

  createDraft: async (
    data: CreateDraftPayload
  ): Promise<ResponseError | string | ZodError> => {
    const parsed = DraftSchema.parse(data);
    const res = await axios.post<ResponseError | string | ZodError>('/drafts', parsed);
    return res.data;
  },

  deleteDraft: async (
    draftId: string
  ): Promise<ResponseError | { message: string }> => {
    const res = await axios.delete<ResponseError | { message: string }>('/drafts', {
        params: { id: draftId },
    });
    return res.data;
  },

  getDraft: async (
    draftId: string
  ): Promise<ResponseError | DraftDetail> => {
    const res = await axios.get<ResponseError | DraftDetail>('/drafts', {
        params: { id: draftId },
    });
    return res.data;
  },

  updateDraft: async (
    draftId: string,
    content: string
  ): Promise<ResponseError | { message: string; code: number }> => {
    const res = await axios.put<ResponseError | { message: string; code: number }>(
        '/drafts',
        { id: draftId, content }
    );
    return res.data;
  },

  publishDraft: async (
    draftId: string,
    blogData: {
        title: string;
        description: string;
        imageUrl: string;
        categories: string[];
    }
  ): Promise<ResponseError | string | ZodError> => {
    const res = await axios.post<ResponseError | string | ZodError>(
        `/drafts/${draftId}/publish`,
        blogData
    );
    return res.data;
  },
};

export default draftApi;
