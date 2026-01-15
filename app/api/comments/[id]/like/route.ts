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
            { error: { message: 'please login to like comment', code: 401 } },
            { status: 401 }
        );
    }

    const { id: commentId } = await params;

    const isLiked =
        !!(await prisma.blogComment.findFirst({
            where: {
                id: commentId,
                likedBy: {
                    some: {
                        email: user.email,
                    },
                },
            },
            select: { id: true },
        }));

    if (!isLiked) {
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
                likedBy: {
                    connect: {
                        email: user.email,
                    },
                },
            },
        });

        return NextResponse.json({ message: 'successfully liked comment' }, { status: 200 });
    }

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
        },
    });

    return NextResponse.json(
        { message: 'successfully removed like from comment' },
        { status: 200 }
    );
}
