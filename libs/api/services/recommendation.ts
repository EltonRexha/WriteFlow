import axios from '@/config/axios';
import { ResponseError } from '@/types/ResponseError';
import type { BlogPagination, DisplayBlog } from '@/libs/api/services/blog';

const recommendationApi = {
  getForYouBlogs: async (
    page: number = 1
  ): Promise<ResponseError | BlogPagination<DisplayBlog>> => {
    const res = await axios.get<BlogPagination<DisplayBlog>>(`/recommendation/for-you`, { params: { page } });
    return res.data;
  },

  getFollowingBlogs: async (
    page: number = 1
  ): Promise<ResponseError | BlogPagination<DisplayBlog>> => {
    const res = await axios.get<BlogPagination<DisplayBlog>>(`/recommendation/following`, { params: { page } });
    return res.data;
  },

  getBlogsByTopic: async (
    topic: string,
    page: number = 1
  ): Promise<ResponseError | BlogPagination<DisplayBlog>> => {
    const res = await axios.get<BlogPagination<DisplayBlog>>(`/recommendation/topic`, { params: { topic, page } });
    return res.data;
  },
};

export default recommendationApi;
