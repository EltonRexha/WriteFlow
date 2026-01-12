'use client';
import { toggleLikeBlog } from '@/libs/api/blog';
import { ThumbsUp } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { isActionError } from '@/types/ActionError';

const ToggleLikeBlogBtn = ({
  blogId,
  isLiked,
}: {
  blogId: string;
  isLiked: boolean;
}) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => toggleLikeBlog(blogId),
    onSuccess: (res) => {
      if (isActionError(res)) return;
      router.refresh();
    },
  });

  const handleLike = async () => {
    mutation.mutate();
  };

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost hover:text-green-500 transition-colors',
        isLiked ? 'text-green-500' : ''
      )}
      onClick={handleLike}
    >
      <ThumbsUp height={20} />
    </button>
  );
};

export default ToggleLikeBlogBtn;
