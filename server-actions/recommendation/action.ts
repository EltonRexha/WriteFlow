'use server';
import prisma from '@/prisma/client';
import { ActionError } from '@/types/ActionError';
import { getServerSession } from 'next-auth';

const BLOGS_PER_PAGE = 10;

export interface DisplayBlog {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  createdAt: Date;
  Author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    likedBy: number;
    dislikedBy: number;
    viewedBy: number;
  };
}

interface BlogPagination {
  blogs: DisplayBlog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function getBlogsByTopic(
  topic: string,
  page: number = 1
): Promise<ActionError | BlogPagination> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return {
      error: { message: 'please login to view blogs by topic', code: 401 },
    };
  }
  const skip = (page - 1) * BLOGS_PER_PAGE;

  const blogs = await prisma.blog.findMany({
    where: {
      Categories: {
        some: {
          name: topic,
        },
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
          viewedBy: true,
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

export async function forYouBlogs(
  page: number = 1
): Promise<ActionError | BlogPagination> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return {
      error: { message: 'please login to view for you blogs', code: 401 },
    };
  }

  const skip = (page - 1) * BLOGS_PER_PAGE;

  const blogs = await prisma.blog.findMany({
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
          viewedBy: true,
        },
      },
    },
  });

  const totalBlogs = await prisma.blog.count();

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

export async function followingBlogs(
  page: number = 1
): Promise<ActionError | BlogPagination> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return {
      error: { message: 'please login to view following blogs', code: 401 },
    };
  }
  const skip = (page - 1) * BLOGS_PER_PAGE;

  const blogs = await prisma.blog.findMany({
    where: {
      Author: {
        FollowedBy: {
          some: {
            email: user.email,
          },
        },
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
          viewedBy: true,
        },
      },
    },
  });

  const totalBlogs = await prisma.blog.count({
    where: {
      Author: {
        FollowedBy: {
          some: {
            email: user.email,
          },
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
