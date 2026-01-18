'use client';
import { toggleDislikeBlog } from '@/libs/api/blog';
import { ThumbsDown } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { isActionError } from '@/types/ActionError';

const ToggleDislikeBlogBtn = ({
  blogId,
  isDisliked,
}: {
  blogId: string;
  isDisliked: boolean;
}) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => toggleDislikeBlog(blogId),
    onSuccess: (res) => {
      if (isActionError(res)) return;
      router.refresh();
    },
  });

  const handleDislike = async () => {
    mutation.mutate();
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
