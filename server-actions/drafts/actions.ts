'use server';

import prisma from '@/prisma/client';
import { DraftSchema } from '@/schemas/draftSchema';
import { getServerSession } from 'next-auth';
import { z, ZodError } from 'zod';
import { ActionError } from '@/types/ActionError';

type Draft = z.infer<typeof DraftSchema>;

export async function createDraft(
  data: Draft
): Promise<ActionError | string | ZodError> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    return { error: { message: 'please login to save draft', code: 401 } };
  }

  const draft = DraftSchema.safeParse(data);

  if (draft.error) {
    return draft.error;
  }

  const draftData = draft.data;

  const existingDraft = await prisma.draft.findFirst({
    where: {
      Author: {
        email: user.email,
      },
      name: draftData.name,
    },
  });

  if (existingDraft) {
    return {
      error: { message: 'draft with this name already exists', code: 400 },
    };
  }

  const createdDraft = await prisma.draft.create({
    data: {
      name: draftData.name,
      Author: {
        connect: {
          email: user.email,
        },
      },
      BlogContent: {
        create: {
          content: draftData.content,
        },
      },
    },
  });

  return createdDraft.id;
}
