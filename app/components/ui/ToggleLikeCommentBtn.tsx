'use client';
import { ThumbsUp } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { toggleLike } from '@/server-actions/comments/action';

const ToggleLikeComment = ({
  isLiked,
  commentId,
}: {
  isLiked: boolean;
  commentId: string;
}) => {
  const router = useRouter();

  const handleLike = async () => {
    await toggleLike(commentId);
    router.refresh();
  };

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost btn-sm hover:text-green-500 transition-colors',
        isLiked ? 'text-green-500' : ''
      )}
      onClick={handleLike}
    >
      <ThumbsUp height={15} />
    </button>
  );
};

export default ToggleLikeComment;
