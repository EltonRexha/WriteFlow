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
                    id: true,
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
            likedBy: {
                where: {
                    email: user.email,
                },
                select: {
                    email: true,
                },
            },
            dislikedBy: {
                where: {
                    email: user.email,
                },
                select: {
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const commentsWithLikes = comments.map((comment) => {
        const isLiked = Array.isArray(comment.likedBy) && comment.likedBy.length > 0;
        const isDisliked = Array.isArray(comment.dislikedBy) && comment.dislikedBy.length > 0;

        return {
            id: comment.id,
            content: comment.content,
            Author: comment.Author,
            createdAt: comment.createdAt,
            _count: comment._count,
            isLiked,
            isDisliked,
        };
    });

    return NextResponse.json({ comments: commentsWithLikes }, { status: 200 });
}
