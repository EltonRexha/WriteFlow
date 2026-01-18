'use client';
import { ThumbsUp } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';
import { toggleLikeComment } from '@/libs/api/comments';
import { useMutation } from '@tanstack/react-query';

const ToggleLikeComment = ({
  isLiked,
  commentId,
  onLike,
}: {
  isLiked: boolean;
  commentId: string;
  onLike: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: () => toggleLikeComment(commentId),
    onSuccess: () => {
      onLike();
    },
  });

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost btn-sm hover:text-green-500 transition-colors',
        isLiked ? 'text-green-500' : ''
      )}
      onClick={() => mutation.mutate()}
    >
      <ThumbsUp height={15} />
    </button>
  );
};

export default ToggleLikeComment;
