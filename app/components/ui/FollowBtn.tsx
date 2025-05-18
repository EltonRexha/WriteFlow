'use client';
import {
  followed,
  followUser,
  unfollowUser,
} from '@/server-actions/user/action';
import { isActionError } from '@/types/ActionError';
import React, { useEffect, useState } from 'react';
import { useToast } from '../ToastProvider';
import useClientUser from '@/hooks/useClientUser';

const FollowBtn = ({ userId }: { userId?: string | null }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();
  const loggedUser = useClientUser();

  useEffect(() => {
    async function fetchIsFollowed() {
      if (!userId) {
        return;
      }
      const isFollowed = await followed({ id: userId });
      if (isActionError(isFollowed)) {
        addToast('something went wrong', 'error');
        return;
      }
      setIsFollowed(isFollowed);
      setIsLoading(false);
    }

    fetchIsFollowed();
  }, [setIsFollowed, addToast, userId]);

  if (!loggedUser || !userId || loggedUser.id === userId) {
    return null;
  }

  const handleToggleFollow = async () => {
    setIsProcessing(true);
    if (isFollowed) {
      const res = await unfollowUser({ id: userId });
      if (isActionError(res)) {
        addToast('Something went wrong un-following user', 'error');
        setIsLoading(false);
        return;
      }
      setIsFollowed(false);
    } else {
      const res = await followUser({ id: userId });
      if (isActionError(res)) {
        addToast('Something went wrong following user', 'error');
        setIsLoading(false);
        return;
      }
      setIsFollowed(true);
    }
    setIsProcessing(false);
  };

  return (
    <button
      className="btn btn-sm btn-primary capitalize"
      onClick={handleToggleFollow}
      disabled={isLoading || isProcessing}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : isFollowed ? (
        'unfollow'
      ) : (
        'follow'
      )}
    </button>
  );
};

export default FollowBtn;
