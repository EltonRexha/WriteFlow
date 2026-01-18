'use client';
import { ThumbsDown } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';
import { toggleDislikeComment } from '@/libs/api/comments';
import { useMutation } from '@tanstack/react-query';

const ToggleDislikeComment = ({
  isDisliked,
  commentId,
  onDislike,
}: {
  isDisliked: boolean;
  commentId: string;
  onDislike: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: () => toggleDislikeComment(commentId),
    onSuccess: () => {
      onDislike();
    },
  });

  return (
    <button
      className={clsx(
        'btn btn-circle btn-ghost btn-sm  hover:text-red-500 transition-colors',
        isDisliked ? 'text-red-500' : ''
      )}
      onClick={() => mutation.mutate()}
    >
      <ThumbsDown height={15} />
    </button>
  );
};

export default ToggleDislikeComment;
