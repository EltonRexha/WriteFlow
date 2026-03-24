import { useQuery } from '@tanstack/react-query';
import sidebarApi from '@/libs/api/services/sidebar';

export const sidebarQueryKeys = {
  all: ['sidebar'] as const,
  content: () => [...sidebarQueryKeys.all, 'content'] as const,
};

export function useSidebarContent() {
  return useQuery({
    queryKey: sidebarQueryKeys.content(),
    queryFn: sidebarApi.getSidebarContent,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: false,
  });
}
