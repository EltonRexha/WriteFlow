'use client';
import { ThumbsUp } from 'lucide-react';
import React, { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useToggleLikeComment } from '@/hooks/queries/comments';
import useClientUser from '@/hooks/useClientUser';

const ToggleLikeComment = ({
  isLiked,
  commentId,
  onLike,
}: {
  isLiked: boolean;
  commentId: string;
  onLike: () => void;
}) => {
  const user = useClientUser();
  const isAuthenticated = !!user;
  const mutation = useToggleLikeComment();

  const handleLike = useCallback(() => {
    if (!isAuthenticated) return;
    mutation.mutate(commentId);
  }, [mutation, commentId, isAuthenticated]);

  useEffect(() => {
    if (mutation.isSuccess) {
      onLike();
      mutation.reset();
    }
  }, [mutation.isSuccess, onLike, mutation]);

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost btn-sm hover:text-green-500 transition-colors',
        isLiked ? 'text-green-500' : '',
        !isAuthenticated && 'cursor-not-allowed'
      )}
      onClick={handleLike}
      disabled={mutation.isPending || !isAuthenticated}
      title={!isAuthenticated ? 'Sign in to like comments' : ''}
      style={!isAuthenticated ? { color: 'inherit' } : {}}
    >
      {mutation.isPending ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <ThumbsUp height={15} />
      )}
    </button>
  );
};

export default ToggleLikeComment;
