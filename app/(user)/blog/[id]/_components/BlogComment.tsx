'use client';
import React, { useState, useCallback } from 'react';
import defaultProfile from '@/public/profile.svg';
import Image from 'next/image';
import { format } from 'date-fns';
import ToggleLikeComment from './ToggleLikeCommentBtn';
import ToggleDislikeComment from './ToggleDislikeCommentBtn';
import type { Comment } from '@/libs/api/services/comments';

const BlogComment = ({
  id,
  content,
  Author: { image, name: authorName },
  createdAt,
  _count,
  isLiked = false,
  isDisliked = false,
}: Comment) => {
  const [commentLikeStatus, setCommentLikeStatus] = useState<
    'none' | 'liked' | 'disliked'
  >(isLiked ? 'liked' : isDisliked ? 'disliked' : 'none');

  const handleLike = useCallback(() => {
    if (commentLikeStatus === 'disliked') {
      _count.dislikedBy -= 1;
      _count.likedBy += 1;
      setCommentLikeStatus('liked');
      return;
    }

    if (commentLikeStatus === 'liked') {
      _count.likedBy -= 1;
      setCommentLikeStatus('none');
      return;
    }

    if (commentLikeStatus === 'none') {
      _count.likedBy += 1;
      setCommentLikeStatus('liked');
      return;
    }
  }, [commentLikeStatus, _count]);

  const handleDislike = useCallback(() => {
    if (commentLikeStatus === 'disliked') {
      _count.dislikedBy -= 1;
      setCommentLikeStatus('none');
      return;
    }

    if (commentLikeStatus === 'liked') {
      _count.likedBy -= 1;
      _count.dislikedBy += 1;
      setCommentLikeStatus('disliked');
      return;
    }

    if (commentLikeStatus === 'none') {
      _count.dislikedBy += 1;
      setCommentLikeStatus('disliked');
      return;
    }
  }, [commentLikeStatus, _count]);

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center space-x-2 mt-4">
        <div className="w-8 aspect-square relative cursor-pointer ">
          {!image ? (
            <Image
              src={defaultProfile}
              alt="user picture"
              fill
              quality={50}
              className="rounded-full"
            />
          ) : (
            <Image
              src={image}
              alt="user picture"
              fill
              quality={50}
              className="rounded-full"
            />
          )}
        </div>
        <p className="text-primary ">{authorName}</p>
        <p className="text-base-content/60 text-sm">
          {format(new Date(createdAt as any), 'PPP')}
        </p>
      </div>
      <div className="ml-1 min-w-0">
        <p className="text-base-content/80 break-words whitespace-pre-wrap">{content}</p>
      </div>
      <div className="flex space-x-2 items-center">
        <div className="flex items-center">
          <ToggleLikeComment
            isLiked={commentLikeStatus === 'liked'}
            commentId={id}
            onLike={handleLike}
          />
          <p className="text-sm text-base-content/70">{_count.likedBy}</p>
        </div>
        <div className="flex items-center">
          <ToggleDislikeComment
            isDisliked={commentLikeStatus === 'disliked'}
            commentId={id}
            onDislike={handleDislike}
          />
          <p className="text-sm text-base-content/70">{_count.dislikedBy}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogComment;
