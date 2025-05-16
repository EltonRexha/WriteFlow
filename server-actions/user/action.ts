'use server';

import prisma from '@/prisma/client';

export async function getUser({ email, id }: { email?: string; id?: string }) {
  return await prisma.user.findUnique({
    where: {
      email,
      id,
    },
  });
}
