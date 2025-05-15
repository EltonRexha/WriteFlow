'use server';
import prisma from '@/prisma/client';

const BLOGS_PER_PAGE = 10;

export async function getBlogsByTopic(
  topic: string,
  page: number = 1
) {
  const skip = (page - 1) * BLOGS_PER_PAGE;

  const blogs = await prisma.blog.findMany({
    where: {
      Categories: {
        some: {
          name: topic,
        },
      },
    },
    orderBy: {
      likedBy: {
        _count: 'desc',
      },
    },
    take: BLOGS_PER_PAGE,
    skip,
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      createdAt: true,
      Author: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          likedBy: true,
          dislikedBy: true,
        },
      },
    },
  });

  const totalBlogs = await prisma.blog.count({
    where: {
      Categories: {
        some: {
          name: topic,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE);

  return {
    blogs,
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}