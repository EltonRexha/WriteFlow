import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession();
    const email = session?.user?.email;

    if (!email) {
        return NextResponse.json(
            { error: { message: 'please login to like blog', code: 401 } },
            { status: 401 }
        );
    }

    const { id: blogId } = params;

    const isLiked =
        !!(await prisma.blog.findFirst({
            where: {
                id: blogId,
                likedBy: {
                    some: {
                        email,
                    },
                },
            },
            select: {
                id: true,
            },
        }));

    if (!isLiked) {
        await prisma.blog.update({
            where: {
                id: blogId,
            },
            data: {
                dislikedBy: {
                    disconnect: {
                        email,
                    },
                },
                likedBy: {
                    connect: {
                        email,
                    },
                },
            },
        });

        return NextResponse.json(
            { message: 'successfully liked blog' },
            { status: 200 }
        );
    }

    await prisma.blog.update({
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

    return NextResponse.json(
        { message: 'successfully removed like from blog' },
        { status: 200 }
    );
}
