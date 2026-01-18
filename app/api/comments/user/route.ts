import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to view you comments', code: 401 } },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');

    if (!blogId) {
        return NextResponse.json(
            { error: { message: 'blogId is required', code: 400 } },
            { status: 400 }
        );
    }

    const comments = await prisma.blogComment.findMany({
        where: {
            Blog: {
                id: blogId,
            },
            Author: {
                email: user.email,
            },
        },
        select: {
            id: true,
            content: true,
            Author: {
                select: {
                    image: true,
                    name: true,
                    email: true,
                },
            },
            createdAt: true,
            _count: {
                select: {
                    likedBy: true,
                    dislikedBy: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const commentsWithLikes = await Promise.all(
        comments.map(async (comment) => {
            const isLiked =
                !!(await prisma.blogComment.findFirst({
                    where: {
                        id: comment.id,
                        likedBy: {
                            some: {
                                email: user.email as string,
                            },
                        },
                    },
                    select: { id: true },
                }));

            const isDisliked =
                !!(await prisma.blogComment.findFirst({
                    where: {
                        id: comment.id,
                        dislikedBy: {
                            some: {
                                email: user.email as string,
                            },
                        },
                    },
                    select: { id: true },
                }));

            return {
                ...comment,
                isLiked,
                isDisliked,
            };
        })
    );

    return NextResponse.json({ comments: commentsWithLikes }, { status: 200 });
}
