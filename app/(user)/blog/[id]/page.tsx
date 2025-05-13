import { getBlog } from '@/server-actions/blogs/action';
import clsx from 'clsx';
import { Limelight } from 'next/font/google';
import React from 'react';
import Image from 'next/image';
import defaultProfile from '@/public/profile.svg';
import { Dot } from 'lucide-react';
import { format } from 'date-fns';
import BlogContent from '@/app/components/BlogContent';
import ToggleLikeBlogBtn from '@/app/components/ui/ToggleLikeBlogBtn';
import ToggleDislikeBlogBtn from '@/app/components/ui/ToggleDislikeBlogBtn';
import { getComments } from '@/server-actions/comments/action';
import BlogComment from '@/app/components/ui/BlogComment';

const limeLight = Limelight({
  weight: '400',
  subsets: ['latin'],
});

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const blog = await getBlog(id);
  const comments = await getComments(id);

  if (!blog.data) {
    return 'not found';
  }

  const authorImage = blog.data.Author.image;

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
            {blog.data.title}
          </h1>
          <p className="text-xl text-base-content/70 pt-2 font-medium">
            {blog.data.description}
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
            <p className="text-primary ">{blog.data.Author.name}</p>
            <button className="btn btn-secondary rounded-4xl btn-dash btn-sm">
              Follow
            </button>
            <Dot />
            <p className="text-base-content/60 text-sm">
              {format(blog.data.createdAt, 'PPP')}
            </p>
          </div>

          <Image
            src={blog.data.imageUrl}
            alt=""
            width={0}
            height={0}
            sizes="100%"
            quality={100}
            className="w-full pt-4"
          />
        </div>
        <div
          id="mainSection"
          className="border-base-content/70 border-b-[1px] "
        >
          <div className="my-4">
            {blog.data.BlogContent.content && (
              <BlogContent content={blog.data.BlogContent.content as string} />
            )}
          </div>
          <div id="likeSection" className="pt-2 mb-10">
            <div className="flex space-x-2 items-center">
              <div className="flex items-center">
                <ToggleLikeBlogBtn blogId={id} isLiked={!!blog.isLiked} />
                <p className="text-sm text-base-content/70">
                  {blog.data._count.likedBy}
                </p>
              </div>
              <div className="flex items-center">
                <ToggleDislikeBlogBtn
                  blogId={id}
                  isDisliked={!!blog.isDisliked}
                />
                <p className="text-sm text-base-content/70">
                  {blog.data._count.dislikedBy}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="commentSection" className="mt-10 space-y-5">
          <h2 className="text-2xl font-bold">Replies ({comments.length})</h2>
          <div className="space-y-2">
            {comments.map((data) => (
              <BlogComment key={data.id} {...data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
