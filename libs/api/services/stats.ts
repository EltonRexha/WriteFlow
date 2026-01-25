import axios from '@/config/axios';
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

const statsApi = {
  getTotalBlogsStats: async (): Promise<ResponseError | TotalBlogStats> => {
    const res = await axios.get<TotalBlogStats>('/stats/blogs/total');
    return res.data;
  },

  getTotalCommentsStats: async (): Promise<
    ResponseError | TotalCommentsStats
  > => {
    const res = await axios.get<TotalCommentsStats>('/stats/comments/total');
    return res.data;
  },

  getBlogStats: async (
    blogId: string
  ): Promise<ResponseError | BlogStats | null> => {
    const res = await axios.get<BlogStats | null>(`/stats/blogs/${blogId}`);
    return res.data;
  },
};

export default statsApi;
