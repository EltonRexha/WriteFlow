import { addView, getBlog } from '@/server-actions/blogs/action';
import clsx from 'clsx';
import { Limelight } from 'next/font/google';
import React from 'react';
import Image from 'next/image';
import defaultProfile from '@/public/profile.svg';
import { Dot, Eye } from 'lucide-react';
import { format } from 'date-fns';
import BlogContent from './_components/BlogContent';
import ToggleLikeBlogBtn from './_components/ToggleLikeBlogBtn';
import ToggleDislikeBlogBtn from './_components/ToggleDislikeBlogBtn';
import BlogComments from './_components/BlogComments';
import FollowBtn from '@/app/components/ui/FollowBtn';
import { getUser } from '@/server-actions/user/action';

const limeLight = Limelight({
  weight: '400',
  subsets: ['latin'],
});

const page = async ({ params }: { params: { id: string } }) => {
  const id = (await params).id;
  const blog = await getBlog(id);

  if (!blog.data) {
    return 'not found';
  }

  const user = await getUser({ email: blog.data.Author.email as string });

  const authorImage = blog.data.Author.image;
  addView(id);

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
            <FollowBtn userId={user!.id} />
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
              <div className="flex items-center space-x-2 ml-auto">
                <Eye />
                <p className="text-sm text-base-content/70">
                  {blog.data._count.viewedBy}
                </p>
              </div>
            </div>
          </div>
        </div>
        <BlogComments blogId={id} />
      </div>
    </div>
  );
};

export default page;
