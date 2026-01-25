'use client';
import { ThumbsUp } from 'lucide-react';
import React, { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useToggleLikeComment } from '@/hooks/queries/comments';

const ToggleLikeComment = ({
  isLiked,
  commentId,
  onLike,
}: {
  isLiked: boolean;
  commentId: string;
  onLike: () => void;
}) => {
  const mutation = useToggleLikeComment();

  const handleLike = useCallback(() => {
    mutation.mutate(commentId);
  }, [mutation, commentId]);

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
        isLiked ? 'text-green-500' : ''
      )}
      onClick={handleLike}
      disabled={mutation.isPending}
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
