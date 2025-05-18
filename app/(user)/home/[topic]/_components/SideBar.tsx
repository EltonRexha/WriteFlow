import prisma from '@/prisma/client';
import clsx from 'clsx';
import { format, startOfMonth, startOfToday } from 'date-fns';
import { Limelight } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const limeLight = Limelight({
  weight: '400',
});

const SideBar = async () => {
  const [popularBlogs, popularWriters] = await Promise.all([
    getPopularBlogs(),
    getPopularWriters(),
  ]);

  return (
    <div className="w-96 p-10 border-l min-h-[90vh] fixed border-base-content/10 space-y-10">
      <div>
        {popularBlogs.length && (
          <>
            <h1
              className={clsx(
                'text-2xl text-base-content p-2',
                limeLight.className
              )}
            >
              Popular
            </h1>
            {popularBlogs.map(({ id, Author, createdAt, title }) => (
              <div key={id}>
                <article className="flex gap-6 py-6 cursor-pointer border-base-content/10 group">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
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
                      <span className="text-sm text-base-content/70">
                        {Author.name}
                      </span>
                      <span className="text-sm text-base-content/60">·</span>
                      <time className="text-sm text-base-content/60">
                        {format(new Date(createdAt), 'MMM d')}
                      </time>
                    </div>
                    <Link
                      href={`/blog/${id}`}
                      className="block group-hover:text-primary transition-colors"
                    >
                      <h2 className="text-base font-bold line-clamp-2">
                        {title}
                      </h2>
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </>
        )}
      </div>

      <div>
        {popularBlogs.length && (
          <>
            <h1
              className={clsx(
                'text-2xl text-base-content p-2',
                limeLight.className
              )}
            >
              Writers
            </h1>
            {popularWriters.map((writer) => (
              <div
                key={writer.id}
                className="flex items-center gap-4 py-4 cursor-pointer px-2 rounded-lg transition-colors group"
              >
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <Image
                      src={writer.image || '/profile.svg'}
                      alt={writer.name || 'Writer'}
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                <Link href={`/user/${writer.id}`}>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base-content group-hover:text-primary">
                      {writer.name}
                    </h3>
                    <p className="text-sm text-base-content/70">
                      {writer._count.Blogs} blogs · {writer._count.FollowedBy}{' '}
                      followers
                    </p>
                    <div className="text-xs text-base-content/60 line-clamp-1">
                      Most popular: {writer.Blogs[0]?.title}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

function getPopularBlogs(take: number = 3) {
  const monthStart = startOfMonth(startOfToday());

  return prisma.blog.findMany({
    where: {
      createdAt: {
        gte: monthStart,
      },
    },
    orderBy: [
      {
        likedBy: {
          _count: 'desc',
        },
      },
      {
        viewedBy: {
          _count: 'desc',
        },
      },
    ],
    include: {
      Author: true,
    },
    take,
  });
}

async function getPopularWriters(take: number = 3) {
  const monthStart = startOfMonth(startOfToday());

  return prisma.user.findMany({
    where: {
      Blogs: {
        some: {
          createdAt: {
            gte: monthStart,
          },
        },
      },
    },
    include: {
      // Get their recent blogs to calculate engagement
      Blogs: {
        where: {
          createdAt: {
            gt: monthStart,
          },
        },
        orderBy: [
          {
            likedBy: {
              _count: 'desc',
            },
          },
          {
            viewedBy: {
              _count: 'desc',
            },
          },
        ],
        take: 2, // Get their top 2 blogs from this week
        include: {
          _count: {
            select: {
              likedBy: true,
              viewedBy: true,
            },
          },
        },
      },
      _count: {
        select: {
          Blogs: true,
          FollowedBy: true,
        },
      },
    },
    orderBy: [
      {
        Blogs: {
          _count: 'desc',
        },
      },
      {
        FollowedBy: {
          _count: 'desc',
        },
      },
    ],
    take,
  });
}

export default SideBar;
