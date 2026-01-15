import axios from '@/config/axios';
import { BlogCommentSchema } from '@/schemas/blogCommentSchema';
import { ResponseError } from '@/types/ResponseError';
import { z, ZodError } from 'zod';
import { isResponseError } from '@/types/guards/isResponseError';

type CreateCommentPayload = z.infer<typeof BlogCommentSchema>;

export interface Comment {
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
    comments: Comment[];
    pagination: Pagination;
}

export async function getComments(
    blogId: string,
    page: number = 1
): Promise<ResponseError | CommentsResponse> {
    try {
        const res = await axios.get<ResponseError | CommentsResponse>('/comments', {
            params: { blogId, page },
        });
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function getUserComments(
    blogId: string
): Promise<ResponseError | { comments: Comment[] }> {
    try {
        const res = await axios.get<ResponseError | { comments: Comment[] }>(
            '/comments/user',
            {
                params: { blogId },
            }
        );
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function createComment(
    payload: CreateCommentPayload
): Promise<ResponseError | string | ZodError> {
    try {
        const parsed = BlogCommentSchema.parse(payload);
        const res = await axios.post<ResponseError | string | ZodError>('/comments', parsed);
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function toggleLikeComment(
    commentId: string
): Promise<ResponseError | { message: string }> {
    try {
        const res = await axios.post<ResponseError | { message: string }>(
            `/comments/${commentId}/like`
        );
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function toggleDislikeComment(
    commentId: string
): Promise<ResponseError | { message: string }> {
    try {
        const res = await axios.post<ResponseError | { message: string }>(
            `/comments/${commentId}/dislike`
        );
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}
