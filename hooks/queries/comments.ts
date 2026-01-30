import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import commentApi from '@/libs/api/services/comments';

export const commentQueryKeys = {
  all: ['comments'] as const,
  list: (blogId: string) => [...commentQueryKeys.all, blogId] as const,
  user: (blogId: string) => [...commentQueryKeys.all, 'user', blogId] as const,
};

export function useComments({ blogId }: { blogId: string }) {
  return useQuery({
    queryKey: commentQueryKeys.list(blogId),
    queryFn: () => commentApi.getComments(blogId, 1),
    retry: false,
  });
}

export function useUserComments({ blogId }: { blogId: string }) {
  return useQuery({
    queryKey: commentQueryKeys.user(blogId),
    queryFn: () => commentApi.getUserComments(blogId),
    retry: false,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(variables.blogId) });
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.user(variables.blogId) });
    },
  });
}

export function useToggleLikeComment() {
  return useMutation({
    mutationKey: ['comments', 'like'] as const,
    mutationFn: commentApi.toggleLikeComment,
  });
}

export function useToggleDislikeComment() {
  return useMutation({
    mutationKey: ['comments', 'dislike'] as const,
    mutationFn: commentApi.toggleDislikeComment,
  });
}
