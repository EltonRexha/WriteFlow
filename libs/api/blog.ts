import axios from '@/config/axios';
import { BlogSchema } from '@/schemas/blogSchema';
import { EditBlogPreviewSchema } from '@/schemas/editBlogSchema';
import { ActionError } from '@/types/ActionError';
import { z, ZodError } from 'zod';

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
  | ActionError
  | {
    data: BlogDetail;
    isLiked?: boolean;
    isDisliked?: boolean;
  };

export async function updatePreview(data: UpdatePreview) {
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
}

export async function createBlog(
  data: CreateBlog
): Promise<ActionError | string | ZodError> {
  try {
    const parsed = BlogSchema.parse(data);
    const res = await axios.post<ActionError | string | ZodError>('/blog', parsed);
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError | ZodError;
    throw err;
  }
}

export async function getBlog(id: string): Promise<GetBlogResponse> {
  try {
    const res = await axios.get<GetBlogResponse>(`/blog/${id}`);
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}

export async function deleteBlog(
  blogId: string
): Promise<ActionError | { message: string; code: number }> {
  try {
    const res = await axios.delete<ActionError | { message: string; code: number }>(
      `/blog/${blogId}`
    );
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}

export async function autocompleteBlogsByTitle(title: string): Promise<
  | ActionError
  | {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
  }[]
> {
  try {
    const res = await axios.get<
      | ActionError
      | {
        id: string;
        title: string;
        imageUrl: string;
        description: string;
      }[]
    >('/blog/autocomplete', {
      params: {
        title,
      },
    });
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}

export async function getUserBlogs(
  email: string,
  page: number = 1
): Promise<ActionError | BlogPagination<DisplayBlog>> {
  try {
    const res = await axios.get<ActionError | BlogPagination<DisplayBlog>>(
      `/blog/user`,
      {
        params: {
          email,
          page,
        },
      }
    );
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}

export async function toggleLikeBlog(
  blogId: string
): Promise<ActionError | { message: string }> {
  try {
    const res = await axios.post<ActionError | { message: string }>(
      `/blog/${blogId}/like`
    );
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}

export async function toggleDislikeBlog(
  blogId: string
): Promise<ActionError | { message: string }> {
  try {
    const res = await axios.post<ActionError | { message: string }>(
      `/blog/${blogId}/dislike`
    );
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}
