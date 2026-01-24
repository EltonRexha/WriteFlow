import { useQuery } from '@tanstack/react-query';
import categoryApi from '@/libs/api/services/categories';

export const categoryQueryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryQueryKeys.all, "list"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryQueryKeys.list(),
    queryFn: categoryApi.getCategories,
    retry: false,
  });
}
