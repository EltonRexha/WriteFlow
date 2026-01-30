'use client';
import { useToggleDislikeBlog } from '@/hooks/queries/blog';
import { ThumbsDown } from 'lucide-react';
import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { isActionError } from '@/types/ActionError';
import useClientUser from '@/hooks/useClientUser';

const ToggleDislikeBlogBtn = ({
  blogId,
  isDisliked,
}: {
  blogId: string;
  isDisliked: boolean;
}) => {
  const router = useRouter();
  const user = useClientUser();
  const isAuthenticated = !!user;
  const mutation = useToggleDislikeBlog();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) return;
      router.refresh();
      mutation.reset();
    }
  }, [mutation.isSuccess, mutation.data, router, mutation]);

  const handleDislike = useCallback(() => {
    if (!isAuthenticated) return;
    mutation.mutate(blogId);
  }, [mutation, blogId, isAuthenticated]);

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost hover:text-red-500 transition-colors',
        isDisliked ? 'text-red-500' : '',
        !isAuthenticated && 'cursor-not-allowed'
      )}
      onClick={handleDislike}
      disabled={mutation.isPending || !isAuthenticated}
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
