'use client';
import { isActionError } from '@/types/ActionError';
import React, { useEffect } from 'react';
import { useToast } from '../ToastProvider';
import useClientUser from '@/hooks/useClientUser';
import { useIsFollowed, useFollowUser, useUnfollowUser } from '@/hooks/queries/user';

const FollowBtn = ({ userId }: { userId?: string | null }) => {
  const { addToast } = useToast();
  const loggedUser = useClientUser();

  const isSelf = !!loggedUser && !!userId && loggedUser.id === userId;

  const { data: isFollowedRes, isLoading } = useIsFollowed({
    userId: userId as string,
  });

  useEffect(() => {
    if (isFollowedRes && isActionError(isFollowedRes)) {
      addToast('something went wrong', 'error');
    }
  }, [addToast, isFollowedRes]);

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  useEffect(() => {
    if (followMutation.isSuccess && followMutation.data) {
      if (isActionError(followMutation.data)) {
        addToast('Something went wrong following user', 'error');
        return;
      }
    }
  }, [followMutation.isSuccess, followMutation.data, addToast]);

  useEffect(() => {
    if (followMutation.isError) {
      addToast('Something went wrong following user', 'error');
    }
  }, [followMutation.isError, addToast]);

  useEffect(() => {
    if (unfollowMutation.isSuccess && unfollowMutation.data) {
      if (isActionError(unfollowMutation.data)) {
        addToast('Something went wrong un-following user', 'error');
        return;
      }
    }
  }, [unfollowMutation.isSuccess, unfollowMutation.data, addToast]);

  useEffect(() => {
    if (unfollowMutation.isError) {
      addToast('Something went wrong un-following user', 'error');
    }
  }, [unfollowMutation.isError, addToast]);

  if (!loggedUser || !userId || isSelf) {
    return null;
  }

  const handleToggleFollow = async () => {
    const isFollowed = typeof isFollowedRes === 'boolean' ? isFollowedRes : false;
    if (isFollowed) {
      unfollowMutation.mutate(userId as string);
      return;
    }
    followMutation.mutate(userId as string);
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
