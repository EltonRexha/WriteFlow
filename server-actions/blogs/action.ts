'use server';

import prisma from '@/prisma/client';
import { BlogSchema } from '@/schemas/blogSchema';
import { ActionError } from '@/types/ActionError';
import { getServerSession } from 'next-auth';
import { z, ZodError } from 'zod';

type Blog = z.infer<typeof BlogSchema>;

export async function createBlog(
  data: Blog
): Promise<ActionError | string | ZodError> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'please login to publish blog', code: 401 } };
  }

  const blog = BlogSchema.safeParse(data);

  if (blog.error) {
    return blog.error;
  }

  const blogData = blog.data;

  const existingBlog = await prisma.blog.findFirst({
    where: {
      Author: {
        email: user.email,
      },
      title: blogData.title,
    },
  });

  if (existingBlog) {
    return {
      error: { message: 'draft with this name already exists', code: 400 },
    };
  }

  const createdBlog = await prisma.blog.create({
    data: {
      title: blogData.title,
      imageUrl: blogData.imageUrl,
      description: blogData.description,
      Author: {
        connect: {
          email: user.email,
        },
      },
      BlogContent: {
        create: {
          content: blogData.content,
        },
      },
    },
  });

  return createdBlog.id;
}
