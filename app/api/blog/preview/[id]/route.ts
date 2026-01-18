import prisma from '@/prisma/client';
import { EditBlogPreviewSchema } from '@/schemas/editBlogSchema';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const json = await req.json();
  const body = EditBlogPreviewSchema.safeParse(json);

  if (body.error) {
    return NextResponse.json(body.error, {
      status: 400,
    });
  }

  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      {
        error: 'user not authenticated',
      },
      {
        status: 401,
      }
    );
  }

  const data = body.data;

  const blog = await prisma.blog.findUnique({
    where: {
      id: data.id,
      Author: {
        email: user.email,
      },
    },
  });

  if (!blog) {
    return NextResponse.json(
      {
        error: 'blog not found',
      },
      {
        status: 404,
      }
    );
  }

  await prisma.blog.update({
    where: {
      id: data.id,
      Author: {
        email: user.email,
      },
    },
    data: {
      title: data.title,
      description: data.description,
      Categories: {
        set: data.categories.map((category) => ({
          name: category,
        })),
      },
      imageUrl: data.imageUrl,
    },
  });

  return NextResponse.json(
    {
      error: 'blog preview updated',
    },
    {
      status: 200,
    }
  );
}
