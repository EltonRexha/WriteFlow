import axios from '@/config/axios';
import type { ActionError } from '@/types/ActionError';
import type { BlogPagination, DisplayBlog } from '@/libs/api/blog';

async function safeGet<T>(url: string, params?: Record<string, unknown>): Promise<T | ActionError> {
    try {
        const res = await axios.get<T>(url, { params });
        return res.data;
    } catch (err) {
        const data = (err as any)?.response?.data;
        if (data) return data as ActionError;
        throw err;
    }
}

export async function getForYouBlogs(
    page: number = 1
): Promise<ActionError | BlogPagination<DisplayBlog>> {
    return (await safeGet<BlogPagination<DisplayBlog>>('/recommendation/for-you', {
        page,
    })) as ActionError | BlogPagination<DisplayBlog>;
}

export async function getFollowingBlogs(
    page: number = 1
): Promise<ActionError | BlogPagination<DisplayBlog>> {
    return (await safeGet<BlogPagination<DisplayBlog>>('/recommendation/following', {
        page,
    })) as ActionError | BlogPagination<DisplayBlog>;
}

export async function getBlogsByTopic(
    topic: string,
    page: number = 1
): Promise<ActionError | BlogPagination<DisplayBlog>> {
    return (await safeGet<BlogPagination<DisplayBlog>>('/recommendation/topic', {
        topic,
        page,
    })) as ActionError | BlogPagination<DisplayBlog>;
}
