import React from 'react';
import defaultProfile from '@/public/profile.svg';
import Image from 'next/image';
import { format } from 'date-fns';
import ToggleLikeComment from './ToggleLikeCommentBtn';
import ToggleDislikeComment from './ToggleDislikeCommentBtn';

interface Props {
  id: string;
  createdAt: Date;
  Author: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  content: string;
}

const BlogComment = ({
  content,
  Author: { image, name: authorName },
  createdAt,
}: Props) => {
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
          <ToggleLikeComment isLiked={false} />
          <p className="text-sm text-base-content/70">3</p>
        </div>
        <div className="flex items-center">
          <ToggleDislikeComment isDisliked={false} />
          <p className="text-sm text-base-content/70">2</p>
        </div>
      </div>
    </div>
  );
};

export default BlogComment;
