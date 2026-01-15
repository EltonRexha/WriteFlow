import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to dislike comment', code: 401 } },
            { status: 401 }
        );
    }

    const { id: commentId } = await params;

    const isDisliked =
        !!(await prisma.blogComment.findFirst({
            where: {
                id: commentId,
                dislikedBy: {
                    some: {
                        email: user.email,
                    },
                },
            },
            select: { id: true },
        }));

    if (!isDisliked) {
        await prisma.blogComment.update({
            where: {
                id: commentId,
            },
            data: {
                likedBy: {
                    disconnect: {
                        email: user.email,
                    },
                },
                dislikedBy: {
                    connect: {
                        email: user.email,
                    },
                },
            },
        });

        return NextResponse.json(
            { message: 'successfully disliked comment' },
            { status: 200 }
        );
    }

    await prisma.blogComment.update({
        where: {
            id: commentId,
        },
        data: {
            dislikedBy: {
                disconnect: {
                    email: user.email,
                },
            },
        },
    });

    return NextResponse.json(
        { message: 'successfully removed dislike from comment' },
        { status: 200 }
    );
}
