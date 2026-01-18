import axios from '@/config/axios';
import { ResponseError } from '@/types/ResponseError';
import type { BlogPagination, DisplayBlog } from '@/libs/api/blog';
import { isResponseError } from '@/types/guards/isResponseError';

export async function getForYouBlogs(
    page: number = 1
): Promise<ResponseError | BlogPagination<DisplayBlog>> {
    try {
        const res = await axios.get<BlogPagination<DisplayBlog>>(`/recommendation/for-you`, { params: { page } });
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function getFollowingBlogs(
    page: number = 1
): Promise<ResponseError | BlogPagination<DisplayBlog>> {
    try {
        const res = await axios.get<BlogPagination<DisplayBlog>>(`/recommendation/following`, { params: { page } });
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function getBlogsByTopic(
    topic: string,
    page: number = 1
): Promise<ResponseError | BlogPagination<DisplayBlog>> {
    try {
        const res = await axios.get<BlogPagination<DisplayBlog>>(`/recommendation/topic`, { params: { topic, page } });
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}
