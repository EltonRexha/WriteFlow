import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import commentApi from '@/libs/api/services/comments';

export const commentQueryKeys = {
  all: ['comments'] as const,
  list: (blogId: string, renderId?: string) => [...commentQueryKeys.all, blogId, renderId] as const,
  user: (blogId: string, renderId?: string) => [...commentQueryKeys.all, 'user', blogId, renderId] as const,
};

export function useComments({ blogId, renderId }: { blogId: string; renderId?: string }) {
  return useQuery({
    queryKey: commentQueryKeys.list(blogId, renderId),
    queryFn: () => commentApi.getComments(blogId, 1),
    retry: false,
  });
}

export function useUserComments({ blogId, renderId }: { blogId: string; renderId?: string }) {
  return useQuery({
    queryKey: commentQueryKeys.user(blogId, renderId),
    queryFn: () => commentApi.getUserComments(blogId),
    retry: false,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey;
          return key[0] === 'comments' && key[1] === variables.blogId;
        }
      });
    },
  });
}

export function useToggleLikeComment() {
  return useMutation({
    mutationFn: commentApi.toggleLikeComment,
  });
}

export function useToggleDislikeComment() {
  return useMutation({
    mutationFn: commentApi.toggleDislikeComment,
  });
}
