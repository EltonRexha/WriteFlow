import prisma from "@/prisma/client";
import React from "react";
import Image from "next/image";
import defaultProfile from "@/public/profile.svg";
import { Dot, Eye, FileQuestion, Home, Search } from "lucide-react";
import { format } from "date-fns";
import BlogContent from "./BlogContent";
import BlogReactions from "./BlogReactions";
import BlogComments from "./BlogComments";
import FollowBtn from "@/components/ui/FollowBtn";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Limelight } from "next/font/google";
import clsx from "clsx";

const limeLight = Limelight({
  weight: "400",
  subsets: ["latin"],
  preload: true,
});

interface BlogContentWrapperProps {
  blogId: string;
}

export default async function BlogContentWrapper({
  blogId,
}: BlogContentWrapperProps) {
  const session = await getServerSession();
  const user = session?.user;

  const blog = await prisma.blog.findFirst({
    where: {
      id: blogId,
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
      likedBy: user?.email
        ? {
            where: {
              email: user.email,
            },
            select: {
              email: true,
            },
          }
        : false,
      dislikedBy: user?.email
        ? {
            where: {
              email: user.email,
            },
            select: {
              email: true,
            },
          }
        : false,
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <FileQuestion className="w-16 h-16 mx-auto text-base-content/50" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-base-content/70 mb-6">
            We couldn&apos;t find the blog post you&apos;re looking for. It might have been deleted or the URL is incorrect.
          </p>
          <div className="space-y-3">
            <Link href="/home" className="btn btn-primary w-full">
              <Search className="w-4 h-4 mr-2" />
              Browse Blogs
            </Link>
            <Link href="/dashboard" className="btn btn-ghost w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLiked = !!user?.email && Array.isArray(blog.likedBy) && blog.likedBy.length > 0;
  const isDisliked =
    !!user?.email && Array.isArray(blog.dislikedBy) && blog.dislikedBy.length > 0;

  if (user?.email) {
    prisma.blog
      .update({
        where: {
          id: blogId,
        },
        data: {
          viewedBy: {
            connect: {
              email: user.email,
            },
          },
        },
      })
      .catch(() => {});
  }

  const author = blog.Author;
  const authorImage = blog.Author.image;

  return (
    <div className="pt-4">
      <div id="mainContent" className="max-w-[82ch] px-2 m-auto text-pretty">
        <div id="thumbnail" className="relative">
          <h1
            className={clsx(
              "font-bold text-4xl break-words leading-tight",
              limeLight.className,
            )}
          >
            {blog.title}
          </h1>
          <p className="text-xl text-base-content/70 pt-2 font-medium line-clamp-3 leading-relaxed break-words">
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
              {format(blog.createdAt, "PPP")}
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
        <div id="mainSection" className="">
          <div className="my-4">
            {blog.BlogContent.content && (
              <BlogContent content={blog.BlogContent.content as string} />
            )}
          </div>
          <div id="likeSection" className="pt-2 mb-10">
            <div className="flex space-x-2 items-center">
              <BlogReactions
                blogId={blogId}
                initialIsLiked={isLiked}
                initialIsDisliked={isDisliked}
                initialLikedCount={blog._count.likedBy}
                initialDislikedCount={blog._count.dislikedBy}
              />
              <div className="flex items-center space-x-2 ml-auto">
                <Eye />
                <p className="text-sm text-base-content/70">
                  {blog._count.viewedBy}
                </p>
              </div>
            </div>
          </div>
        </div>
        <BlogComments blogId={blogId} />
      </div>
    </div>
  );
}
