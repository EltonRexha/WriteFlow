import axios from "@/config/axios";
import { BlogSchema } from "@/schemas/blogSchema";
import { EditBlogPreviewSchema } from "@/schemas/editBlogSchema";
import { isResponseError } from "@/types/guards/isResponseError";
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

export async function updatePreview(
  data: UpdatePreview,
): Promise<ResponseError | ZodError | { error: string }> {
  try {
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
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function createBlog(
  data: CreateBlog,
): Promise<ResponseError | string | ZodError> {
  const res = await axios.post<ResponseError | string | ZodError>(
    "/blog",
    data,
  );
  return res.data;
}

export async function getBlog(id: string): Promise<GetBlogResponse> {
  try {
    const res = await axios.get<GetBlogResponse>(`/blog/${id}`);
    return res.data;
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function deleteBlog(
  blogId: string,
): Promise<ResponseError | { message: string; code: number }> {
  try {
    const res = await axios.delete<
      ResponseError | { message: string; code: number }
    >(`/blog/${blogId}`);
    return res.data;
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function autocompleteBlogsByTitle(title: string): Promise<
  | ResponseError
  | {
      id: string;
      title: string;
      imageUrl: string;
      description: string;
    }[]
> {
  try {
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
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function getUserBlogs(
  email: string,
  page: number = 1,
): Promise<ResponseError | BlogPagination<DisplayBlog>> {
  try {
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
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function toggleLikeBlog(
  blogId: string,
): Promise<ResponseError | { message: string }> {
  try {
    const res = await axios.post<ResponseError | { message: string }>(
      `/blog/${blogId}/like`,
    );
    return res.data;
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function toggleDislikeBlog(
  blogId: string,
): Promise<ResponseError | { message: string }> {
  try {
    const res = await axios.post<ResponseError | { message: string }>(
      `/blog/${blogId}/dislike`,
    );
    return res.data;
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}
