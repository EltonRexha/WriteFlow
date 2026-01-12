import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to view your stats', code: 401 } },
            { status: 401 }
        );
    }

    const statsPerComment = await prisma.blogComment.findMany({
        where: {
            Author: {
                email: user.email,
            },
        },
        select: {
            _count: {
                select: {
                    dislikedBy: true,
                    likedBy: true,
                },
            },
        },
    });

    const stats = statsPerComment.reduce(
        (prev, curr) => {
            return {
                _count: {
                    dislikedBy: prev._count.dislikedBy + curr._count.dislikedBy,
                    likedBy: prev._count.likedBy + curr._count.likedBy,
                },
            };
        },
        {
            _count: {
                likedBy: 0,
                dislikedBy: 0,
            },
        }
    );

    return NextResponse.json(stats, { status: 200 });
}
