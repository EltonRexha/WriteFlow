'use server';

import prisma from '@/prisma/client';
import { DraftSchema } from '@/schemas/draftSchema';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { ActionError } from '@/types/ActionError';

type Draft = z.infer<typeof DraftSchema>;

export async function createDraft(data: Draft): Promise<ActionError | string> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return { error: { message: 'please login to save draft', code: 401 } };
  }

  const draft = await prisma.draft.findFirst({
    where: {
      Author: {
        email: user.email,
      },
      name: data.name,
    },
  });

  if (draft) {
    return {
      error: { message: 'draft with this name already exists', code: 400 },
    };
  }

  const createdDraft = await prisma.draft.create({
    data: {
      name: data.name,
      Author: {
        connect: {
          email: user.email as string,
        },
      },
      BlogContent: {
        create: {
          content: data.content,
        },
      },
    },
  });

  return createdDraft.id;
}
