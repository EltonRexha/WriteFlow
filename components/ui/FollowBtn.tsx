'use client';
import { isActionError } from '@/types/ActionError';
import React, { useEffect } from 'react';
import { useToast } from '../ToastProvider';
import useClientUser from '@/hooks/useClientUser';
import {
  followUser,
  getIsFollowed,
  unfollowUser,
} from '@/libs/api/user';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const FollowBtn = ({ userId }: { userId?: string | null }) => {
  const { addToast } = useToast();
  const loggedUser = useClientUser();

  const queryClient = useQueryClient();

  const isSelf = !!loggedUser && !!userId && loggedUser.id === userId;

  const { data: isFollowedRes, isLoading } = useQuery({
    queryKey: ['isFollowed', userId],
    queryFn: () => getIsFollowed(userId as string),
    enabled: !!loggedUser && !!userId && !isSelf,
    retry: false,
  });

  useEffect(() => {
    if (isFollowedRes && isActionError(isFollowedRes)) {
      addToast('something went wrong', 'error');
    }
  }, [addToast, isFollowedRes]);

  const followMutation = useMutation({
    mutationFn: () => followUser(userId as string),
    onSuccess: (res) => {
      if (isActionError(res)) {
        addToast('Something went wrong following user', 'error');
        return;
      }
      queryClient.setQueryData(['isFollowed', userId], true);
    },
    onError: () => {
      addToast('Something went wrong following user', 'error');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId as string),
    onSuccess: (res) => {
      if (isActionError(res)) {
        addToast('Something went wrong un-following user', 'error');
        return;
      }
      queryClient.setQueryData(['isFollowed', userId], false);
    },
    onError: () => {
      addToast('Something went wrong un-following user', 'error');
    },
  });

  if (!loggedUser || !userId || isSelf) {
    return null;
  }

  const handleToggleFollow = async () => {
    const isFollowed = typeof isFollowedRes === 'boolean' ? isFollowedRes : false;
    if (isFollowed) {
      unfollowMutation.mutate();
      return;
    }
    followMutation.mutate();
  };

  const isFollowed = typeof isFollowedRes === 'boolean' ? isFollowedRes : false;
  const isProcessing = followMutation.isPending || unfollowMutation.isPending;

  return (
    <button
      className="btn btn-sm btn-primary capitalize"
      onClick={handleToggleFollow}
      disabled={isLoading || isProcessing}
    >
      {isFollowed ? 'unfollow' : 'follow'}
    </button>
  );
};

export default FollowBtn;
