import axios from '@/config/axios';
import { BlogCommentSchema } from '@/schemas/blogCommentSchema';
import type { ActionError } from '@/types/ActionError';
import { z, ZodError } from 'zod';

type CreateCommentPayload = z.infer<typeof BlogCommentSchema>;

export interface CommentDto {
    id: string;
    content: string;
    Author: {
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
    comments: CommentDto[];
    pagination: Pagination;
}

export async function getComments(
    blogId: string,
    page: number = 1
): Promise<ActionError | CommentsResponse> {
    try {
        const res = await axios.get<ActionError | CommentsResponse>('/comments', {
            params: { blogId, page },
        });
        return res.data;
    } catch (err) {
        const data = (err as any)?.response?.data;
        if (data) return data as ActionError;
        throw err;
    }
}

export async function getUserComments(
    blogId: string
): Promise<ActionError | { comments: CommentDto[] }> {
    try {
        const res = await axios.get<ActionError | { comments: CommentDto[] }>(
            '/comments/user',
            {
                params: { blogId },
            }
        );
        return res.data;
    } catch (err) {
        const data = (err as any)?.response?.data;
        if (data) return data as ActionError;
        throw err;
    }
}

export async function createComment(
    payload: CreateCommentPayload
): Promise<ActionError | string | ZodError> {
    try {
        const parsed = BlogCommentSchema.parse(payload);
        const res = await axios.post<ActionError | string | ZodError>('/comments', parsed);
        return res.data;
    } catch (err) {
        const data = (err as any)?.response?.data;
        if (data) return data as ActionError | ZodError;
        throw err;
    }
}

export async function toggleLikeComment(
    commentId: string
): Promise<ActionError | { message: string }> {
    try {
        const res = await axios.post<ActionError | { message: string }>(
            `/comments/${commentId}/like`
        );
        return res.data;
    } catch (err) {
        const data = (err as any)?.response?.data;
        if (data) return data as ActionError;
        throw err;
    }
}

export async function toggleDislikeComment(
    commentId: string
): Promise<ActionError | { message: string }> {
    try {
        const res = await axios.post<ActionError | { message: string }>(
            `/comments/${commentId}/dislike`
        );
        return res.data;
    } catch (err) {
        const data = (err as any)?.response?.data;
        if (data) return data as ActionError;
        throw err;
    }
}
