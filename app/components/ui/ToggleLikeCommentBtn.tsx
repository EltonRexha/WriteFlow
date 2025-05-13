'use client';
import { ThumbsUp } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const ToggleLikeComment = ({ isLiked }: { isLiked: boolean }) => {
  const router = useRouter();

  const handleLike = async () => {
    // await toggleLike(blogId);
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
