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

    const statsPerBlog = await prisma.blog.findMany({
        where: {
            Author: {
                email: user.email,
            },
        },
        select: {
            _count: {
                select: {
                    viewedBy: true,
                    BlogComment: true,
                    dislikedBy: true,
                    likedBy: true,
                },
            },
        },
    });

    const stats = statsPerBlog.reduce(
        (prev, curr) => {
            return {
                _count: {
                    BlogComment: prev._count.BlogComment + curr._count.BlogComment,
                    dislikedBy: prev._count.dislikedBy + curr._count.dislikedBy,
                    likedBy: prev._count.likedBy + curr._count.likedBy,
                    viewedBy: prev._count.viewedBy + curr._count.viewedBy,
                },
            };
        },
        {
            _count: {
                likedBy: 0,
                dislikedBy: 0,
                BlogComment: 0,
                viewedBy: 0,
            },
        }
    );

    return NextResponse.json(stats, { status: 200 });
}
