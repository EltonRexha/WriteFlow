import axios from '@/config/axios';
import type { ActionError } from '@/types/ActionError';

export interface TotalBlogStats {
    _count: {
        likedBy: number;
        dislikedBy: number;
        BlogComment: number;
        viewedBy: number;
    };
}

export interface TotalCommentsStats {
    _count: {
        likedBy: number;
        dislikedBy: number;
    };
}

export interface BlogStats {
    _count: {
        likedBy: number;
        dislikedBy: number;
        BlogComment: number;
        viewedBy: number;
    };
}

async function safeGet<T>(url: string, params?: Record<string, unknown>) {
    try {
        const res = await axios.get<T>(url, { params });
        return res.data;
    } catch (err) {
        const data = (err as any)?.response?.data;
        if (data) return data as ActionError;
        throw err;
    }
}

export async function getTotalBlogsStats(): Promise<ActionError | TotalBlogStats> {
    return (await safeGet<TotalBlogStats>('/stats/blogs/total')) as
        | ActionError
        | TotalBlogStats;
}

export async function getTotalCommentsStats(): Promise<
    ActionError | TotalCommentsStats
> {
    return (await safeGet<TotalCommentsStats>('/stats/comments/total')) as
        | ActionError
        | TotalCommentsStats;
}

export async function getBlogStats(
    blogId: string
): Promise<ActionError | BlogStats | null> {
    return (await safeGet<BlogStats | null>(`/stats/blogs/${blogId}`)) as
        | ActionError
        | BlogStats
        | null;
}
