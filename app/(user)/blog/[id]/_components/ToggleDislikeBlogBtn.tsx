'use client';
import { useToggleDislikeBlog } from '@/hooks/queries/blog';
import { ThumbsDown } from 'lucide-react';
import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { isActionError } from '@/types/ActionError';
import useClientUser from '@/hooks/useClientUser';
import { useIsMutating } from '@tanstack/react-query';

const ToggleDislikeBlogBtn = ({
  blogId,
  isDisliked,
  onClick,
  disabled,
}: {
  blogId: string;
  isDisliked: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const router = useRouter();
  const user = useClientUser();
  const isAuthenticated = !!user;
  const mutation = useToggleDislikeBlog();
  const isLikeMutating = useIsMutating({ mutationKey: ['blogs', 'like'] }) > 0;
  const isDislikeMutating =
    useIsMutating({ mutationKey: ['blogs', 'dislike'] }) > 0;
  const isAnyBlogReactionMutating = isLikeMutating || isDislikeMutating;

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) return;
      if (!onClick) {
        router.refresh();
      }
      mutation.reset();
    }
  }, [mutation.isSuccess, mutation.data, router, mutation, onClick]);

  const handleDislike = useCallback(() => {
    if (!isAuthenticated) return;
    if (onClick) {
      onClick();
      return;
    }
    mutation.mutate(blogId);
  }, [mutation, blogId, isAuthenticated, onClick]);

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost hover:text-red-500 transition-colors',
        isDisliked ? 'text-red-500' : '',
        !isAuthenticated && 'cursor-not-allowed'
      )}
      onClick={handleDislike}
      disabled={
        !!disabled ||
        mutation.isPending ||
        isAnyBlogReactionMutating ||
        !isAuthenticated
      }
      title={!isAuthenticated ? 'Sign in to dislike blogs' : ''}
      style={!isAuthenticated ? { color: 'inherit' } : {}}
    >
      {mutation.isPending ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <ThumbsDown height={20} />
      )}
    </button>
  );
};

export default ToggleDislikeBlogBtn;
