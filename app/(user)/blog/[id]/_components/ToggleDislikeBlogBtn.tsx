'use client';
import { useToggleDislikeBlog } from '@/hooks/queries/blog';
import { ThumbsDown } from 'lucide-react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { isActionError } from '@/types/ActionError';

const ToggleDislikeBlogBtn = ({
  blogId,
  isDisliked,
}: {
  blogId: string;
  isDisliked: boolean;
}) => {
  const router = useRouter();
  const mutation = useToggleDislikeBlog();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) return;
      router.refresh();
      mutation.reset();
    }
  }, [mutation.isSuccess, mutation.data, router, mutation]);

  const handleDislike = async () => {
    mutation.mutate(blogId);
  };

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost hover:text-red-500 transition-colors',
        isDisliked ? 'text-red-500' : ''
      )}
      onClick={handleDislike}
    >
      <ThumbsDown height={20} />
    </button>
  );
};

export default ToggleDislikeBlogBtn;
