'use client';
import { toggleDislike } from '@/server-actions/blogs/action';
import { ThumbsDown } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const ToggleDislikeBlogBtn = ({
  blogId,
  isDisliked,
}: {
  blogId: string;
  isDisliked: boolean;
}) => {
  const router = useRouter();

  const handleDislike = async () => {
    await toggleDislike(blogId);
    router.refresh();
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
