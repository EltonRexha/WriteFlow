import axios from '@/config/axios';
import { isResponseError } from '@/types/guards/isResponseError';
import { ResponseError } from '@/types/ResponseError';

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

export async function getTotalBlogsStats(): Promise<ResponseError | TotalBlogStats> {
    try {
        const res = await axios.get<TotalBlogStats>('/stats/blogs/total');
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function getTotalCommentsStats(): Promise<
    ResponseError | TotalCommentsStats
> {
    try {
        const res = await axios.get<TotalCommentsStats>('/stats/comments/total');
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}

export async function getBlogStats(
    blogId: string
): Promise<ResponseError | BlogStats | null> {
    try {
        const res = await axios.get<BlogStats | null>(`/stats/blogs/${blogId}`);
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}
