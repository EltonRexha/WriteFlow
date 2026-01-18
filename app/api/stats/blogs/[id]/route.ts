import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to view your stats', code: 401 } },
            { status: 401 }
        );
    }

    const { id: blogId } = await params;

    const stats = await prisma.blog.findFirst({
        where: {
            id: blogId,
            Author: {
                email: user.email,
            },
        },
        select: {
            _count: {
                select: {
                    dislikedBy: true,
                    likedBy: true,
                    BlogComment: true,
                    viewedBy: true,
                },
            },
        },
    });

    return NextResponse.json(stats, { status: 200 });
}
