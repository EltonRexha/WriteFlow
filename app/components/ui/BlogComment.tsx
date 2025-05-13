import React from 'react';
import defaultProfile from '@/public/profile.svg';
import Image from 'next/image';
import { format } from 'date-fns';
import ToggleLikeComment from './ToggleLikeCommentBtn';
import ToggleDislikeComment from './ToggleDislikeCommentBtn';
import { getComments } from '@/server-actions/comments/action';

const BlogComment = ({
  id,
  content,
  Author: { image, name: authorName },
  createdAt,
  _count,
  isLiked,
  isDisliked,
}: Awaited<ReturnType<typeof getComments>>[number]) => {
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
          {format(createdAt, 'PPP')}
        </p>
      </div>
      <div className="ml-1">
        <p className="text-base-content/80">{content}</p>
      </div>
      <div className="flex space-x-2 items-center">
        <div className="flex items-center">
          <ToggleLikeComment isLiked={isLiked} commentId={id} />
          <p className="text-sm text-base-content/70">{_count.likedBy}</p>
        </div>
        <div className="flex items-center">
          <ToggleDislikeComment isDisliked={isDisliked} commentId={id} />
          <p className="text-sm text-base-content/70">{_count.dislikedBy}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogComment;
