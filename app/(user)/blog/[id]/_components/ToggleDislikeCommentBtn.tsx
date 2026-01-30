'use client';
import { ThumbsDown } from 'lucide-react';
import React, { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useToggleDislikeComment } from '@/hooks/queries/comments';
import useClientUser from '@/hooks/useClientUser';
import { useIsMutating } from '@tanstack/react-query';

const ToggleDislikeComment = ({
  isDisliked,
  commentId,
  onDislike,
  onClick,
  disabled,
}: {
  isDisliked: boolean;
  commentId: string;
  onDislike: () => void;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const user = useClientUser();
  const isAuthenticated = !!user;
  const mutation = useToggleDislikeComment();
  const isLikeMutating = useIsMutating({ mutationKey: ['comments', 'like'] }) > 0;
  const isDislikeMutating =
    useIsMutating({ mutationKey: ['comments', 'dislike'] }) > 0;
  const isAnyCommentReactionMutating = isLikeMutating || isDislikeMutating;

  const handleDislike = useCallback(() => {
    if (!isAuthenticated) return;
    if (onClick) {
      onClick();
      return;
    }
    mutation.mutate(commentId);
  }, [mutation, commentId, isAuthenticated, onClick]);

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
      disabled={
        !!disabled ||
        mutation.isPending ||
        isAnyCommentReactionMutating ||
        !isAuthenticated
      }
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
