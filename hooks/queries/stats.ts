import { useQuery } from '@tanstack/react-query';
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
    retry: false,
  });
}

export function useTotalCommentsStats() {
  return useQuery({
    queryKey: statsQueryKeys.totalComments(),
    queryFn: statsApi.getTotalCommentsStats,
    retry: false,
  });
}

export function useBlogStats({ blogId }: { blogId: string }) {
  return useQuery({
    queryKey: statsQueryKeys.blog(blogId),
    queryFn: () => statsApi.getBlogStats(blogId),
    retry: false,
  });
}
