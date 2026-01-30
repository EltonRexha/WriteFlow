'use client';
import { ThumbsDown } from 'lucide-react';
import React, { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useToggleDislikeComment } from '@/hooks/queries/comments';
import useClientUser from '@/hooks/useClientUser';

const ToggleDislikeComment = ({
  isDisliked,
  commentId,
  onDislike,
}: {
  isDisliked: boolean;
  commentId: string;
  onDislike: () => void;
}) => {
  const user = useClientUser();
  const isAuthenticated = !!user;
  const mutation = useToggleDislikeComment();

  const handleDislike = useCallback(() => {
    if (!isAuthenticated) return;
    mutation.mutate(commentId);
  }, [mutation, commentId, isAuthenticated]);

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
        isDisliked ? 'text-red-500' : '',
        !isAuthenticated && 'cursor-not-allowed'
      )}
      onClick={handleDislike}
      disabled={mutation.isPending || !isAuthenticated}
      title={!isAuthenticated ? 'Sign in to dislike comments' : ''}
      style={!isAuthenticated ? { color: 'inherit' } : {}}
    >
      {mutation.isPending ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <ThumbsDown height={15} />
      )}
    </button>
  );
};

export default ToggleDislikeComment;
