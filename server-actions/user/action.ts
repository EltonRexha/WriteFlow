'use server';

import prisma from '@/prisma/client';
import { ActionError } from '@/types/ActionError';
import { getServerSession } from 'next-auth';

export async function getUser({ email, id }: { email?: string; id?: string }) {
  return await prisma.user.findUnique({
    where: {
      email,
      id,
    },
  });
}

export async function followUser({
  id,
}: {
  id: string;
}): Promise<ActionError | { message: string }> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'Please login to follow user', code: 401 } };
  }

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      Follows: {
        connect: {
          id,
        },
      },
    },
  });

  return { message: 'successfully followed user' };
}

export async function unfollowUser({
  id,
}: {
  id: string;
}): Promise<ActionError | { message: string }> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'Please login to follow user', code: 401 } };
  }

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      Follows: {
        disconnect: {
          id,
        },
      },
    },
  });

  return { message: 'successfully unfollowed user' };
}

export async function followed({ id }: { id: string }) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return {
      error: { message: 'Please login to check if you follow user', code: 401 },
    };
  }

  return !!(await prisma.user.findUnique({
    where: {
      id,
      FollowedBy: {
        some: {
          email: user.email,
        },
      },
    },
  }));
}
