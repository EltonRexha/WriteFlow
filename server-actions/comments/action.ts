'use server';
import prisma from '@/prisma/client';
import { BlogCommentSchema } from '@/schemas/blogCommentSchema';
import { ActionError } from '@/types/ActionError';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

type BlogComment = z.infer<typeof BlogCommentSchema>;

const COMMENTS_PER_PAGE = 10;

export async function getComments(blogId: string, page: number = 1) {
  const session = await getServerSession();
  const user = session?.user;

  // Calculate pagination offset
  const skip = (page - 1) * COMMENTS_PER_PAGE;

  const totalComments = await prisma.blogComment.count({
    where: {
      Blog: {
        id: blogId,
      },
      Author: {
        email: user?.email
          ? {
              not: user.email,
            }
          : undefined,
      },
    },
  });

  const comments = await prisma.blogComment.findMany({
    where: {
      Blog: {
        id: blogId,
      },
      Author: {
        email: user?.email
          ? {
              not: user.email,
            }
          : undefined,
      },
    },
    select: {
      id: true,
      content: true,
      Author: {
        select: {
          image: true,
          name: true,
          email: true,
        },
      },
      createdAt: true,
      _count: {
        select: {
          likedBy: true,
          dislikedBy: true,
        },
      },
    },
    orderBy: {
      likedBy: {
        _count: 'desc',
      },
    },
    skip,
    take: COMMENTS_PER_PAGE,
  });

  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);

  if (!user || !user.email) {
    return {
      comments: comments.map((comment) => ({
        ...comment,
        isLiked: false,
        isDisliked: false,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  const commentsWithLikes = await Promise.all(
    comments.map(async (comment) => {
      const isLiked = await commentIsLiked({
        commentId: comment.id,
        email: user.email as string,
      });
      const isDisliked = await commentIsDisliked({
        commentId: comment.id,
        email: user.email as string,
      });

      return {
        ...comment,
        isLiked,
        isDisliked,
      };
    })
  );

  return {
    comments: commentsWithLikes,
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getUserComments(blogId: string) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return {
      error: { message: 'please login to view you comments', code: 401 },
    };
  }

  const comments = await prisma.blogComment.findMany({
    where: {
      Blog: {
        id: blogId,
      },
      Author: {
        email: user.email,
      },
    },
    select: {
      id: true,
      content: true,
      Author: {
        select: {
          image: true,
          name: true,
          email: true,
        },
      },
      createdAt: true,
      _count: {
        select: {
          likedBy: true,
          dislikedBy: true,
        },
      },
    },
    orderBy: {
      likedBy: {
        _count: 'desc',
      },
    },
  });

  const commentsWithLikes = await Promise.all(
    comments.map(async (comment) => {
      const isLiked = await commentIsLiked({
        commentId: comment.id,
        email: user.email as string,
      });
      const isDisliked = await commentIsDisliked({
        commentId: comment.id,
        email: user.email as string,
      });

      return {
        ...comment,
        isLiked,
        isDisliked,
      };
    })
  );

  return {
    comments: commentsWithLikes,
  };
}

export async function createComment(data: BlogComment) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'please login to comment on blog', code: 401 } };
  }

  const blog = BlogCommentSchema.safeParse(data);

  if (blog.error) {
    return blog.error;
  }

  const { blogId, content } = blog.data;

  const blogComment = await prisma.blogComment.create({
    data: {
      content: content,
      Blog: {
        connect: {
          id: blogId,
        },
      },
      Author: {
        connect: {
          email: user.email,
        },
      },
    },
  });

  return blogComment.id;
}

export async function toggleLike(
  commentId: string
): Promise<ActionError | string> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'please login to like comment', code: 401 } };
  }

  const isLiked = !!(await prisma.blogComment.findUnique({
    where: {
      id: commentId,
      likedBy: {
        some: {
          email: user.email,
        },
      },
    },
  }));

  if (!isLiked) {
    await removeDislike({ commentId, email: user.email });
    await addLike({ commentId, email: user.email });

    return 'successfully liked comment';
  }

  await removeLike({ commentId, email: user.email });

  return 'successfully removed like from comment';
}

export async function toggleDislike(
  commentId: string
): Promise<ActionError | string> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'please login to dislike comment', code: 401 } };
  }

  const isDisliked = !!(await prisma.blogComment.findUnique({
    where: {
      id: commentId,
      dislikedBy: {
        some: {
          email: user.email,
        },
      },
    },
  }));

  if (!isDisliked) {
    await removeLike({ commentId, email: user.email });
    await addDislike({ commentId, email: user.email });

    return 'successfully disliked comment';
  }

  await removeDislike({ commentId, email: user.email });

  return 'successfully removed dislike from comment';
}

async function commentIsLiked({
  commentId,
  email,
}: {
  commentId: string;
  email: string;
}) {
  return !!(await prisma.blogComment.findUnique({
    where: {
      id: commentId,
      likedBy: {
        some: {
          email,
        },
      },
    },
  }));
}

async function commentIsDisliked({
  commentId,
  email,
}: {
  commentId: string;
  email: string;
}) {
  return !!(await prisma.blogComment.findUnique({
    where: {
      id: commentId,
      dislikedBy: {
        some: {
          email,
        },
      },
    },
  }));
}

async function removeLike({
  commentId,
  email,
}: {
  commentId: string;
  email: string;
}) {
  return await prisma.blogComment.update({
    where: {
      id: commentId,
    },
    data: {
      likedBy: {
        disconnect: {
          email,
        },
      },
    },
  });
}

async function addLike({
  commentId,
  email,
}: {
  commentId: string;
  email: string;
}) {
  return await prisma.blogComment.update({
    where: {
      id: commentId,
    },
    data: {
      likedBy: {
        connect: {
          email: email,
        },
      },
    },
  });
}

async function removeDislike({
  commentId,
  email,
}: {
  commentId: string;
  email: string;
}) {
  return await prisma.blogComment.update({
    where: {
      id: commentId,
    },
    data: {
      dislikedBy: {
        disconnect: {
          email,
        },
      },
    },
  });
}

async function addDislike({
  commentId,
  email,
}: {
  commentId: string;
  email: string;
}) {
  return await prisma.blogComment.update({
    where: {
      id: commentId,
    },
    data: {
      dislikedBy: {
        connect: {
          email: email,
        },
      },
    },
  });
}
