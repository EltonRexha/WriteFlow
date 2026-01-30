import { keepPreviousData, useQuery } from '@tanstack/react-query';
import statsApi from '@/libs/api/services/stats';

export const statsQueryKeys = {
  all: ['stats'] as const,
  totalBlogs: () => [...statsQueryKeys.all, 'totalBlogs'] as const,
  totalComments: () => [...statsQueryKeys.all, 'totalComments'] as const,
  blog: (blogId: string) => [...statsQueryKeys.all, 'blog', blogId] as const,
};

export function useTotalBlogsStats() {
  return useQuery({
    queryKey: statsQueryKeys.totalBlogs(),
    queryFn: statsApi.getTotalBlogsStats,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useTotalCommentsStats() {
  return useQuery({
    queryKey: statsQueryKeys.totalComments(),
    queryFn: statsApi.getTotalCommentsStats,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useBlogStats({ blogId }: { blogId: string | null }) {
  return useQuery({
    queryKey: statsQueryKeys.blog(blogId ?? 'unknown'),
    queryFn: () => statsApi.getBlogStats(blogId as string),
    enabled: !!blogId,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: false,
  });
}
