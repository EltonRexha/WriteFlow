'use client';
import { ThumbsDown } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const ToggleDislikeComment = ({ isDisliked }: { isDisliked: boolean }) => {
  const router = useRouter();

  const handleDislike = async () => {
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
