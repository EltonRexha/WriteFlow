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

  // Find categories case-insensitively
  const categories = await Promise.all(
    blogData.categories.map(async (name) => {
      const category = await prisma.category.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });
      if (!category) {
        throw new Error(`Category ${name} not found`);
      }
      return { id: category.id };
    })
  );

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
      Categories: {
        connect: categories,
      },
    },
  });

  return createdBlog.id;
}

export async function getBlog(id: string) {
  const session = await getServerSession();
  const user = session?.user;

  const blog = await prisma.blog.findFirst({
    where: {
      id,
    },
    select: {
      Author: {
        select: {
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

  if (!user || !user.email) {
    return { data: blog };
  }

  const isLiked = await blogIsLiked({ blogId: id, email: user.email });
  const isDisliked = await blogIsDisliked({ blogId: id, email: user.email });

  return { data: blog, isLiked, isDisliked };
}

export async function toggleLike(
  blogId: string
): Promise<ActionError | string> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'please login to like blog', code: 401 } };
  }

  const isLiked = !!(await prisma.blog.findUnique({
    where: {
      id: blogId,
      likedBy: {
        some: {
          email: user.email,
        },
      },
    },
  }));

  if (!isLiked) {
    await removeDislike({ blogId, email: user.email });
    await addLike({ blogId, email: user.email });

    return 'successfully liked blog';
  }

  await removeLike({ blogId, email: user.email });

  return 'successfully removed like from blog';
}

export async function toggleDislike(
  blogId: string
): Promise<ActionError | string> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'please login to dislike blog', code: 401 } };
  }

  const isDisliked = !!(await prisma.blog.findUnique({
    where: {
      id: blogId,
      dislikedBy: {
        some: {
          email: user.email,
        },
      },
    },
  }));

  if (!isDisliked) {
    await removeLike({ blogId, email: user.email });
    await addDislike({ blogId, email: user.email });

    return 'successfully disliked blog';
  }

  await removeDislike({ blogId, email: user.email });

  return 'successfully removed dislike from blog';
}

async function blogIsLiked({
  blogId,
  email,
}: {
  blogId: string;
  email: string;
}) {
  return !!(await prisma.blog.findUnique({
    where: {
      id: blogId,
      likedBy: {
        some: {
          email,
        },
      },
    },
  }));
}

async function blogIsDisliked({
  blogId,
  email,
}: {
  blogId: string;
  email: string;
}) {
  return !!(await prisma.blog.findUnique({
    where: {
      id: blogId,
      dislikedBy: {
        some: {
          email,
        },
      },
    },
  }));
}

async function removeLike({
  blogId,
  email,
}: {
  blogId: string;
  email: string;
}) {
  return await prisma.blog.update({
    where: {
      id: blogId,
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

async function addLike({ blogId, email }: { blogId: string; email: string }) {
  return await prisma.blog.update({
    where: {
      id: blogId,
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
  blogId,
  email,
}: {
  blogId: string;
  email: string;
}) {
  return await prisma.blog.update({
    where: {
      id: blogId,
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
  blogId,
  email,
}: {
  blogId: string;
  email: string;
}) {
  return await prisma.blog.update({
    where: {
      id: blogId,
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

export async function addView(blogId: string): Promise<ActionError | string> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'please login to view blog', code: 401 } };
  }

  const blog = await prisma.blog.update({
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
  });

  return blog.id;
}

export interface UserBlogsPagination {
  blogs: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
    _count: {
      likedBy: number;
      dislikedBy: number;
      viewedBy: number;
    };
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function getUserBlogs(
  userEmail: string,
  page: number = 1
): Promise<ActionError | UserBlogsPagination> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return {
      error: { message: 'please login to view user blogs', code: 401 },
    };
  }

  const BLOGS_PER_PAGE = 10;
  const skip = (page - 1) * BLOGS_PER_PAGE;

  const blogs = await prisma.blog.findMany({
    where: {
      Author: {
        email: userEmail,
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
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
        email: userEmail,
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

export async function autocompleteBlogsByTitle({ title }: { title: string }) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return {
      error: { message: 'please login to view your blogs', code: 401 },
    };
  }
  const blogs = await prisma.blog.findMany({
    where: {
      title: {
        contains: title,
        mode: 'insensitive',
      },
      Author: {
        email: user.email,
      },
    },
  });

  return blogs;
}

export async function deleteBlog({ blogId }: { blogId: string }) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return {
      error: { message: 'please login to delete your blog', code: 401 },
    };
  }

  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
      Author: {
        email: user.email,
      },
    },
  });

  if (!blog) {
    if (!user || !user.email) {
      return {
        error: {
          message: 'could not find this blog, or does not belong to you',
          code: 400,
        },
      };
    }
  }

  await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });

  return { message: 'successfully deleted blog', code: 204 };
}
