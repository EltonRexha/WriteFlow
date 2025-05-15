import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { DisplayBlog } from '@/server-actions/recommendation/action';

const BlogPreviewCard = ({
  id,
  title,
  description,
  imageUrl,
  Author,
  createdAt,
  _count,
}: DisplayBlog) => {
  return (
    <article className="flex gap-6 py-6 cursor-pointer border-b border-base-content/10 group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="avatar">
            <div className="w-6 h-6 rounded-full">
              <Image
                src={Author.image || '/profile.svg'}
                alt={Author.name || 'Author'}
                width={24}
                height={24}
              />
            </div>
          </div>
          <span className="text-sm">{Author.name}</span>
          <span className="hidden sm:block text-base-content/60">·</span>
          <time className="hidden sm:block text-sm text-base-content/60">
            {format(new Date(createdAt), 'MMM d')}
          </time>
        </div>

        <Link href={`/blog/${id}`} className="block group">
          <h2 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h2>
          <p className="text-base-content/70 line-clamp-2 mb-2">
            {description}
          </p>
        </Link>

        <div className="flex items-center text-base-content/60 text-sm">
          <div className="flex items-center gap-1">
            <ThumbsUp height={15} />
            {_count.likedBy}
          </div>
          <span className="mx-2">·</span>
          <div className="flex items-center gap-1">
            <ThumbsDown height={15} />
            {_count.dislikedBy}
          </div>
        </div>
      </div>

      <div className="relative w-28 h-28">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
    </article>
  );
};

export default BlogPreviewCard;
