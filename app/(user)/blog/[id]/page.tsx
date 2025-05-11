import { getBlog } from '@/server-actions/blogs/action';
import clsx from 'clsx';
import { Limelight } from 'next/font/google';
import React from 'react';
import Image from 'next/image';
import defaultProfile from '@/public/profile.svg';
import { Dot } from 'lucide-react';
import { format } from 'date-fns';
import BlogContent from '@/app/components/BlogContent';

const limeLight = Limelight({
  weight: '400',
  subsets: ['latin'],
});

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const blog = await getBlog(id);

  if (!blog) {
    return null;
  }
  const authorImage = blog.Author.image;

  return (
    <div className="pt-4">
      <div id="mainContent" className="max-w-[82ch] px-2 m-auto text-pretty">
        <div id="thumbnail" className="relative">
          <h1
            className={clsx(
              'font-bold text-4xl text-base-content',
              limeLight.className
            )}
          >
            {blog?.title}
          </h1>
          <p className="text-xl text-base-content/70 pt-2 font-medium">
            {blog?.description}
          </p>
          <div className="flex items-center space-x-2 mt-4">
            <div className="w-8 aspect-square relative cursor-pointer ">
              {!authorImage ? (
                <Image
                  src={defaultProfile}
                  alt="user picture"
                  fill
                  quality={50}
                  className="rounded-full"
                />
              ) : (
                <Image
                  src={authorImage}
                  alt="user picture"
                  fill
                  quality={50}
                  className="rounded-full"
                />
              )}
            </div>
            <p className="text-primary ">{blog.Author.name}</p>
            <button className="btn btn-secondary rounded-4xl btn-dash btn-sm">
              Follow
            </button>
            <Dot />
            <p className="text-base-content/60 text-sm">
              {format(blog.createdAt, 'PPP')}
            </p>
          </div>

          <Image
            src={blog.imageUrl}
            alt=""
            width={0}
            height={0}
            sizes="100%"
            quality={100}
            className="w-full pt-4"
          />
        </div>
        <div className="my-4">
          {blog.BlogContent.content && (
            <BlogContent content={blog.BlogContent.content as string} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
