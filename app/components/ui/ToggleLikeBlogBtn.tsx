'use client';
import { toggleLike } from '@/server-actions/blogs/action';
import { ThumbsUp } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const ToggleLikeBlogBtn = ({
  blogId,
  isLiked,
}: {
  blogId: string;
  isLiked: boolean;
}) => {
  const router = useRouter();

  const handleLike = async () => {
    await toggleLike(blogId);
    router.refresh();
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
