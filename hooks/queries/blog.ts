import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogApi from '@/libs/api/services/blog';

export const blogQueryKeys = {
  all: ["blogs"] as const,
  detail: (id: string) => [...blogQueryKeys.all, "detail", id] as const,
  user: (email: string, page?: number) => [...blogQueryKeys.all, "user", email, page] as const,
  autocomplete: (title: string) => [...blogQueryKeys.all, "autocomplete", title] as const,
  dashboard: (page?: number) => [...blogQueryKeys.all, "dashboard", page] as const,
};

export function useBlog({ id }: { id: string }) {
  return useQuery({
    queryKey: blogQueryKeys.detail(id),
    queryFn: () => blogApi.getBlog(id),
    retry: false,
  });
}

export function useUserBlogs({ email, page = 1 }: { email: string; page?: number }) {
  return useQuery({
    queryKey: blogQueryKeys.user(email, page),
    queryFn: () => blogApi.getUserBlogs(email, page),
    retry: false,
  });
}

export function useBlogAutocomplete({ title }: { title: string }) {
  return useQuery({
    queryKey: blogQueryKeys.autocomplete(title),
    queryFn: () => blogApi.autocompleteBlogsByTitle(title),
    retry: false,
  });
}

export function useCreateBlog() {
  return useMutation({
    mutationFn: blogApi.createBlog,
  });
}

export function useUpdateBlogPreview() {
  return useMutation({
    mutationFn: blogApi.updatePreview,
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
    },
  });
}

export function useToggleLikeBlog() {
  return useMutation({
    mutationFn: blogApi.toggleLikeBlog,
  });
}

export function useToggleDislikeBlog() {
  return useMutation({
    mutationFn: blogApi.toggleDislikeBlog,
  });
}

export function useUpdateBlogContent() {
  return useMutation({
    mutationFn: ({ blogId, content }: { blogId: string; content: string }) =>
      blogApi.updateBlogContent(blogId, content),
  });
}
