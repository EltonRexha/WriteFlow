import axios from "@/config/axios";
import { BlogSchema } from "@/schemas/blogSchema";
import { EditBlogPreviewSchema } from "@/schemas/editBlogSchema";
import { ResponseError } from "@/types/ResponseError";
import { z, ZodError } from "zod";

type UpdatePreview = z.infer<typeof EditBlogPreviewSchema>;
type CreateBlog = z.infer<typeof BlogSchema>;

export interface DisplayBlog {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  createdAt: string | Date;
  Author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    likedBy: number;
    dislikedBy: number;
    viewedBy: number;
  };
}

export interface BlogPagination<T> {
  blogs: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface BlogDetail {
  Author: {
    email: string | null;
    image: string | null;
    name: string | null;
  };
  BlogContent: {
    content: unknown;
  };
  Categories: {
    name: string;
  }[];
  title: string;
  description: string;
  id: string;
  imageUrl: string;
  createdAt: string | Date;
  _count: {
    likedBy: number;
    dislikedBy: number;
    viewedBy: number;
  };
}

export type GetBlogResponse =
  | ResponseError
  | {
      data: BlogDetail;
      isLiked?: boolean;
      isDisliked?: boolean;
    };

const blogApi = {
  updatePreview: async (
    data: UpdatePreview,
  ): Promise<ZodError<{
    title: string;
    categories: string[];
    imageUrl: string;
    description: string;
    id: string;
  }> | {
    error: string;
  }> => {
    const res = await axios.put<
      | ZodError<{
          title: string;
          categories: string[];
          imageUrl: string;
          description: string;
          id: string;
        }>
      | {
          error: string;
        }
    >(`/blog/preview/${data.id}`, data);
    return res.data;
  },

  createBlog: async (
    data: CreateBlog & { content: string },
  ): Promise<ResponseError | string | ZodError> => {
    const res = await axios.post<ResponseError | string | ZodError>(
      "/blog",
      data,
    );
    return res.data;
  },

  getBlog: async (id: string): Promise<GetBlogResponse> => {
    const res = await axios.get<GetBlogResponse>(`/blog/${id}`);
    return res.data;
  },

  deleteBlog: async (
    blogId: string,
  ): Promise<ResponseError | { message: string; code: number }> => {
    const res = await axios.delete<
      ResponseError | { message: string; code: number }
    >(`/blog/${blogId}`);
    return res.data;
  },

  autocompleteBlogsByTitle: async (title: string): Promise<
    | ResponseError
    | {
        id: string;
        title: string;
        imageUrl: string;
        description: string;
      }[]
  > => {
    const res = await axios.get<
      | ResponseError
      | {
          id: string;
          title: string;
          imageUrl: string;
          description: string;
        }[]
    >("/blog/autocomplete", {
      params: {
        title,
      },
    });
    return res.data;
  },

  getUserBlogs: async (
    email: string,
    page: number = 1,
  ): Promise<ResponseError | BlogPagination<DisplayBlog>> => {
    const res = await axios.get<ResponseError | BlogPagination<DisplayBlog>>(
      `/blog/user`,
      {
        params: {
          email,
          page,
        },
      },
    );
    return res.data;
  },

  toggleLikeBlog: async (
    blogId: string,
  ): Promise<ResponseError | { message: string }> => {
    const res = await axios.post<ResponseError | { message: string }>(
      `/blog/${blogId}/like`,
    );
    return res.data;
  },

  toggleDislikeBlog: async (
    blogId: string,
  ): Promise<ResponseError | { message: string }> => {
    const res = await axios.post<ResponseError | { message: string }>(
      `/blog/${blogId}/dislike`,
    );
    return res.data;
  },

  updateBlogContent: async (
    blogId: string,
    content: string,
  ): Promise<ResponseError | { message: string; code: number }> => {
    const res = await axios.put<
      ResponseError | { message: string; code: number }
    >(`/blog/${blogId}`, { content });
    return res.data;
  },
};

export default blogApi;
