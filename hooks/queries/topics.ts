import { useQuery } from '@tanstack/react-query';
import topicsApi from '@/libs/api/services/topics';

export const topicsQueryKeys = {
  all: ['topics'] as const,
  list: () => [...topicsQueryKeys.all, 'list'] as const,
};

export function useTopics() {
  return useQuery({
    queryKey: topicsQueryKeys.list(),
    queryFn: topicsApi.getTopics,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });
}
