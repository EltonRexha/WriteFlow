'use server';

import prisma from '@/prisma/client';

export async function getCategories() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
    },
  });

  return categories;
}
