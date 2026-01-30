import axios from '@/config/axios';
import { BlogCommentSchema } from '@/schemas/blogCommentSchema';
import { ResponseError } from '@/types/ResponseError';
import { z, ZodError } from 'zod';

type CreateCommentPayload = z.infer<typeof BlogCommentSchema>;

export interface Comment {
    id: string;
    content: string;
    Author: {
        id: string;
        image: string | null;
        name: string | null;
        email: string | null;
    };
    createdAt: string | Date;
    _count: {
        likedBy: number;
        dislikedBy: number;
    };
    isLiked?: boolean;
    isDisliked?: boolean;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface CommentsResponse {
    comments: Comment[];
    pagination: Pagination;
}

const commentApi = {
  getComments: async (
    blogId: string,
    page: number = 1
  ): Promise<ResponseError | CommentsResponse> => {
    const res = await axios.get<ResponseError | CommentsResponse>('/comments', {
        params: { blogId, page },
    });
    return res.data;
  },

  getUserComments: async (
    blogId: string
  ): Promise<ResponseError | { comments: Comment[] }> => {
    const res = await axios.get<ResponseError | { comments: Comment[] }>(
        '/comments/user',
        {
            params: { blogId },
        }
    );
    return res.data;
  },

  createComment: async (
    payload: CreateCommentPayload
  ): Promise<ResponseError | string | ZodError> => {
    const parsed = BlogCommentSchema.parse(payload);
    const res = await axios.post<ResponseError | string | ZodError>('/comments', parsed);
    return res.data;
  },

  toggleLikeComment: async (
    commentId: string
  ): Promise<ResponseError | { message: string }> => {
    const res = await axios.post<ResponseError | { message: string }>(
        `/comments/${commentId}/like`
    );
    return res.data;
  },

  toggleDislikeComment: async (
    commentId: string
  ): Promise<ResponseError | { message: string }> => {
    const res = await axios.post<ResponseError | { message: string }>(
        `/comments/${commentId}/dislike`
    );
    return res.data;
  },
};

export default commentApi;
