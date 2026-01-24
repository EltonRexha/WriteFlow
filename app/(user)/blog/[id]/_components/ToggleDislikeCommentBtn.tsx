'use client';
import { ThumbsDown } from 'lucide-react';
import React, { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useToggleDislikeComment } from '@/hooks/queries/comments';

const ToggleDislikeComment = ({
  isDisliked,
  commentId,
  onDislike,
}: {
  isDisliked: boolean;
  commentId: string;
  onDislike: () => void;
}) => {
  const mutation = useToggleDislikeComment();

  const handleDislike = useCallback(() => {
    mutation.mutate(commentId);
  }, [mutation, commentId]);

  useEffect(() => {
    if (mutation.isSuccess) {
      onDislike();
      mutation.reset();
    }
  }, [mutation.isSuccess, onDislike, mutation]);

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost btn-sm hover:text-red-500 transition-colors',
        isDisliked ? 'text-red-500' : ''
      )}
      onClick={handleDislike}
    >
      <ThumbsDown height={15} />
    </button>
  );
};

export default ToggleDislikeComment;
