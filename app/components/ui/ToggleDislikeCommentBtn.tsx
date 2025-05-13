'use client';
import { ThumbsDown } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { toggleDislike } from '@/server-actions/comments/action';

const ToggleDislikeComment = ({
  isDisliked,
  commentId,
}: {
  isDisliked: boolean;
  commentId: string;
}) => {
  const router = useRouter();

  const handleDislike = async () => {
    await toggleDislike(commentId);
    router.refresh();
  };

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost btn-sm  hover:text-red-500 transition-colors',
        isDisliked ? 'text-red-500' : ''
      )}
      onClick={handleDislike}
    >
      <ThumbsDown height={15} />
    </button>
  );
};

export default ToggleDislikeComment;
