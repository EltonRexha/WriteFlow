import prisma from '@/prisma/client';
import { BlogCommentSchema } from '@/schemas/blogCommentSchema';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

type BlogComment = z.infer<typeof BlogCommentSchema>;

export async function getComments(blogId: string) {
  const comments = await prisma.blogComment.findMany({
    where: {
      Blog: {
        id: blogId,
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
    },
  });

  return comments;
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
