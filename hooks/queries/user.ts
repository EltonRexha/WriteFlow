import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '@/libs/api/services/user';

export const userQueryKeys = {
  all: ['users'] as const,
  me: () => [...userQueryKeys.all, 'me'] as const,
  isFollowed: (userId: string) => [...userQueryKeys.all, 'isFollowed', userId] as const,
};

export function useMe() {
  return useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: userApi.getMe,
    retry: false,
  });
}

export function useIsFollowed({ userId }: { userId: string }) {
  return useQuery({
    queryKey: userQueryKeys.isFollowed(userId),
    queryFn: () => userApi.getIsFollowed(userId),
    retry: false,
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: userApi.createUser,
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.followUser,
    onSuccess: (_, userId) => {
      queryClient.setQueryData(userQueryKeys.isFollowed(userId), true);
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.unfollowUser,
    onSuccess: (_, userId) => {
      queryClient.setQueryData(userQueryKeys.isFollowed(userId), false);
    },
  });
}
