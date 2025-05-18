'use client';
import { ThumbsDown } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';
import { toggleDislike } from '@/server-actions/comments/action';

const ToggleDislikeComment = ({
  isDisliked,
  commentId,
  onDislike,
}: {
  isDisliked: boolean;
  commentId: string;
  onDislike: () => void;
}) => {

  const handleDislike = async () => {
    await toggleDislike(commentId);
    onDislike();
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
