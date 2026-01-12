import prisma from '@/prisma/client';
import { DraftSchema } from '@/schemas/draftSchema';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to save draft', code: 401 } },
            { status: 401 }
        );
    }

    const json = await req.json();
    const parsed = DraftSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(parsed.error, { status: 400 });
    }

    const draftData = parsed.data;

    const existingDraft = await prisma.draft.findFirst({
        where: {
            Author: {
                email: user.email,
            },
            name: draftData.name,
        },
        select: {
            id: true,
        },
    });

    if (existingDraft) {
        return NextResponse.json(
            { error: { message: 'draft with this name already exists', code: 400 } },
            { status: 400 }
        );
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
        select: {
            id: true,
        },
    });

    return NextResponse.json(createdDraft.id, { status: 201 });
}
