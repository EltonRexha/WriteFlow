import prisma from '@/prisma/client';
import { ActionError } from '@/types/ActionError';
import { getServerSession } from 'next-auth';

interface TotalBlogStats {
  _count: {
    likedBy: number;
    dislikedBy: number;
    BlogComment: number;
    viewedBy: number;
  };
}

export async function getTotalBlogsStats(): Promise<
  TotalBlogStats | ActionError
> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return { error: { message: 'please login to view your stats', code: 401 } };
  }

  const statsPerBlog = await prisma.blog.findMany({
    where: {
      Author: {
        email: user.email,
      },
    },
    select: {
      _count: {
        select: {
          viewedBy: true,
          BlogComment: true,
          dislikedBy: true,
          likedBy: true,
        },
      },
    },
  });

  const stats = statsPerBlog.reduce((prev, curr) => {
    return {
      _count: {
        BlogComment: prev._count.BlogComment + curr._count.BlogComment,
        dislikedBy: prev._count.dislikedBy + curr._count.dislikedBy,
        likedBy: prev._count.likedBy + curr._count.likedBy,
        viewedBy: prev._count.viewedBy + curr._count.viewedBy,
      },
    };
  });

  return stats;
}

interface TotalCommentsStats {
  _count: {
    likedBy: number;
    dislikedBy: number;
  };
}

export async function getTotalCommentsStats(): Promise<
  TotalCommentsStats | ActionError
> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return {
      error: { message: 'please login to view your stats', code: 401 },
    };
  }

  const statsPerBlog = await prisma.blogComment.findMany({
    where: {
      Author: {
        email: user.email,
      },
    },
    select: {
      _count: {
        select: {
          dislikedBy: true,
          likedBy: true,
        },
      },
    },
  });

  const stats = statsPerBlog.reduce((prev, curr) => {
    return {
      _count: {
        dislikedBy: prev._count.dislikedBy + curr._count.dislikedBy,
        likedBy: prev._count.likedBy + curr._count.likedBy,
      },
    };
  });

  return stats;
}
