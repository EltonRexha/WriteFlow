import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { startOfMonth, startOfToday } from 'date-fns';

export async function GET() {
  try {
    const [popularBlogs, popularWriters] = await Promise.all([
      getPopularBlogs(),
      getPopularWriters(),
    ]);

    return NextResponse.json({
      popularBlogs,
      popularWriters,
    });
  } catch (error) {
    console.error('Error fetching sidebar content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sidebar content' },
      { status: 500 }
    );
  }
}

async function getPopularBlogs(take: number = 3, monthsBack: number = 0) {
  const monthStart = startOfMonth(startOfToday());
  const searchStart = new Date(monthStart);
  searchStart.setMonth(searchStart.getMonth() - monthsBack);

  const blogs = await prisma.blog.findMany({
    where: {
      createdAt: {
        gte: searchStart,
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

  if (blogs.length === 0 && monthsBack < 6) {
    return getPopularBlogs(take, monthsBack + 1);
  }

  return blogs;
}

async function getPopularWriters(take: number = 3, monthsBack: number = 0) {
  const monthStart = startOfMonth(startOfToday());
  const searchStart = new Date(monthStart);
  searchStart.setMonth(searchStart.getMonth() - monthsBack);

  const writers = await prisma.user.findMany({
    where: {
      Blogs: {
        some: {
          createdAt: {
            gte: searchStart,
          },
        },
      },
    },
    include: {
      Blogs: {
        where: {
          createdAt: {
            gte: searchStart,
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
        take: 2,
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

  if (writers.length === 0 && monthsBack < 6) {
    return getPopularWriters(take, monthsBack + 1);
  }

  return writers;
}
