import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import blogApi, { type BlogPagination, type DisplayBlog } from '@/libs/api/services/blog';

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
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useUserBlogs({ email, page = 1 }: { email: string; page?: number }) {
  return useQuery({
    queryKey: blogQueryKeys.user(email, page),
    queryFn: () => blogApi.getUserBlogs(email, page),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useBlogAutocomplete({ title }: { title: string }) {
  return useQuery({
    queryKey: blogQueryKeys.autocomplete(title),
    queryFn: () => blogApi.autocompleteBlogsByTitle(title),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useCreateBlog() {
  return useMutation({
    mutationFn: blogApi.createBlog,
  });
}

export function useUpdateBlogPreview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApi.updatePreview,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['dashboardUserBlogs'] });

      const previousDashboardUserBlogs = queryClient.getQueryData(
        ['dashboardUserBlogs']
      );

      queryClient.setQueryData(
        ['dashboardUserBlogs'],
        (
          old:
            | InfiniteData<unknown>
            | undefined
            | InfiniteData<BlogPagination<DisplayBlog> | unknown>
        ) => {
          if (!old || typeof old !== 'object' || !('pages' in old)) {
            return old;
          }

          const typedOld = old as InfiniteData<BlogPagination<DisplayBlog> | unknown>;

          return {
            ...typedOld,
            pages: typedOld.pages.map((page) => {
              if (!page || typeof page !== 'object' || !('blogs' in page)) {
                return page;
              }

              const typedPage = page as BlogPagination<DisplayBlog>;

              return {
                ...typedPage,
                blogs: typedPage.blogs.map((blog) =>
                  blog.id === data.id
                    ? {
                        ...blog,
                        title: data.title,
                        description: data.description,
                        imageUrl: data.imageUrl,
                      }
                    : blog
                ),
              };
            }),
          };
        }
      );

      queryClient.setQueryData(blogQueryKeys.detail(data.id), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) {
          return old;
        }

        const typedOld = old as { data: unknown };

        if (!typedOld.data || typeof typedOld.data !== 'object') {
          return old;
        }

        return {
          ...(old as Record<string, unknown>),
          data: {
            ...(typedOld.data as Record<string, unknown>),
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
          },
        };
      });

      return { previousDashboardUserBlogs };
    },
    onError: (_err, _data, ctx) => {
      if (ctx?.previousDashboardUserBlogs) {
        queryClient.setQueryData(
          ['dashboardUserBlogs'],
          ctx.previousDashboardUserBlogs
        );
      }
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dashboardUserBlogs'] });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApi.deleteBlog,
    onMutate: async (blogId: string) => {
      await queryClient.cancelQueries({ queryKey: ['dashboardUserBlogs'] });

      const previousDashboardUserBlogs = queryClient.getQueryData(
        ['dashboardUserBlogs']
      );

      queryClient.setQueryData(
        ['dashboardUserBlogs'],
        (
          old:
            | InfiniteData<unknown>
            | undefined
            | InfiniteData<BlogPagination<DisplayBlog> | unknown>
        ) => {
          if (!old || typeof old !== 'object' || !('pages' in old)) {
            return old;
          }

          const typedOld = old as InfiniteData<BlogPagination<DisplayBlog> | unknown>;

          return {
            ...typedOld,
            pages: typedOld.pages.map((page) => {
              if (!page || typeof page !== 'object' || !('blogs' in page)) {
                return page;
              }

              const typedPage = page as BlogPagination<DisplayBlog>;

              return {
                ...typedPage,
                blogs: typedPage.blogs.filter((blog) => blog.id !== blogId),
              };
            }),
          };
        }
      );

      return { previousDashboardUserBlogs };
    },
    onError: (_err, _blogId, ctx) => {
      if (ctx?.previousDashboardUserBlogs) {
        queryClient.setQueryData(
          ['dashboardUserBlogs'],
          ctx.previousDashboardUserBlogs
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
    },
    onSettled: (_data, _err, blogId) => {
      queryClient.invalidateQueries({ queryKey: ['dashboardUserBlogs'] });
      queryClient.removeQueries({ queryKey: blogQueryKeys.detail(blogId) });
    },
  });
}

export function useToggleLikeBlog() {
  return useMutation({
    mutationKey: ['blogs', 'like'] as const,
    mutationFn: blogApi.toggleLikeBlog,
  });
}

export function useToggleDislikeBlog() {
  return useMutation({
    mutationKey: ['blogs', 'dislike'] as const,
    mutationFn: blogApi.toggleDislikeBlog,
  });
}

export function useUpdateBlogContent() {
  return useMutation({
    mutationFn: ({ blogId, content }: { blogId: string; content: string }) =>
      blogApi.updateBlogContent(blogId, content),
  });
}
