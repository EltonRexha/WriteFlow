import prisma from '@/prisma/client';
import React from 'react';
import Image from 'next/image';
import defaultProfile from '@/public/profile.svg';
import { Dot, Eye } from 'lucide-react';
import { format } from 'date-fns';
import BlogContent from './_components/BlogContent';
import ToggleLikeBlogBtn from './_components/ToggleLikeBlogBtn';
import ToggleDislikeBlogBtn from './_components/ToggleDislikeBlogBtn';
import BlogComments from './_components/BlogComments';
import FollowBtn from '@/components/ui/FollowBtn';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Limelight } from 'next/font/google';
import clsx from 'clsx';

const limeLight = Limelight({
  weight: '400',
  subsets: ['latin'],
  preload: true
});

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await getServerSession();
  const user = session?.user;

  const blog = await prisma.blog.findFirst({
    where: {
      id,
    },
    select: {
      Author: {
        select: {
          id: true,
          email: true,
          image: true,
          name: true,
        },
      },
      BlogContent: {
        select: {
          content: true,
        },
      },
      Categories: {
        select: {
          name: true,
        },
      },
      title: true,
      description: true,
      id: true,
      imageUrl: true,
      createdAt: true,
      _count: {
        select: {
          likedBy: true,
          dislikedBy: true,
          viewedBy: true,
        },
      },
    },
  });

  if (!blog) {
    return 'not found';
  }

  const isLiked =
    !!user?.email &&
    !!(await prisma.blog.findFirst({
      where: {
        id,
        likedBy: {
          some: {
            email: user.email,
          },
        },
      },
      select: {
        id: true,
      },
    }));

  const isDisliked =
    !!user?.email &&
    !!(await prisma.blog.findFirst({
      where: {
        id,
        dislikedBy: {
          some: {
            email: user.email,
          },
        },
      },
      select: {
        id: true,
      },
    }));

  if (user?.email) {
    await prisma.blog.update({
      where: {
        id,
      },
      data: {
        viewedBy: {
          connect: {
            email: user.email,
          },
        },
      },
    });
  }

  const author = blog.Author;
  const renderId = uuid();

  const authorImage = blog.Author.image;

  return (
    <div className="pt-4">
      <div id="mainContent" className="max-w-[82ch] px-2 m-auto text-pretty">
        <div id="thumbnail" className="relative">
          <h1
            className={clsx(
              'font-bold text-4xl',
              limeLight.className
            )}
          >
            {blog.title}
          </h1>
          <p className="text-xl text-base-content/70 pt-2 font-medium">
            {blog.description}
          </p>
          <div className="flex items-center space-x-2 mt-4">
            <Link href={`/user/${author.id}`}>
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
            </Link>
            <Link href={`/user/${author.id}`}>
              <p className="text-primary link">{blog.Author.name}</p>
            </Link>

            <FollowBtn userId={author.id} />
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
        <div
          id="mainSection"
          className=""
        >
          <div className="my-4">
            {blog.BlogContent.content && (
              <BlogContent content={blog.BlogContent.content as string} />
            )}
          </div>
          {user && (
            <div id="likeSection" className="pt-2 mb-10">
              <div className="flex space-x-2 items-center">
                <div className="flex items-center">
                  <ToggleLikeBlogBtn blogId={id} isLiked={!!isLiked} />
                  <p className="text-sm text-base-content/70">
                    {blog._count.likedBy}
                  </p>
                </div>
                <div className="flex items-center">
                  <ToggleDislikeBlogBtn
                    blogId={id}
                    isDisliked={!!isDisliked}
                  />
                  <p className="text-sm text-base-content/70">
                    {blog._count.dislikedBy}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-auto">
                  <Eye />
                  <p className="text-sm text-base-content/70">
                    {blog._count.viewedBy}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <BlogComments blogId={id} renderId={renderId} />
      </div>
    </div>
  );
};

export default page;
