import prisma from '@/prisma/client';
import { BlogCommentSchema } from '@/schemas/blogCommentSchema';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const COMMENTS_PER_PAGE = 10;

export async function GET(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');
    const pageParam = searchParams.get('page');
    const page = pageParam ? Number(pageParam) : 1;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;

    if (!blogId) {
        return NextResponse.json(
            { error: { message: 'blogId is required', code: 400 } },
            { status: 400 }
        );
    }

    const skip = (safePage - 1) * COMMENTS_PER_PAGE;

    const totalComments = await prisma.blogComment.count({
        where: {
            Blog: {
                id: blogId,
            },
            Author: {
                email: user?.email
                    ? {
                        not: user.email,
                    }
                    : undefined,
            },
        },
    });

    const comments = await prisma.blogComment.findMany({
        where: {
            Blog: {
                id: blogId,
            },
            Author: {
                email: user?.email
                    ? {
                        not: user.email,
                    }
                    : undefined,
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
            likedBy: {
                _count: 'desc',
            },
        },
        skip,
        take: COMMENTS_PER_PAGE,
    });

    const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);

    if (!user?.email) {
        return NextResponse.json(
            {
                comments: comments.map((comment) => ({
                    ...comment,
                    isLiked: false,
                    isDisliked: false,
                })),
                pagination: {
                    currentPage: safePage,
                    totalPages,
                    hasNextPage: safePage < totalPages,
                    hasPreviousPage: safePage > 1,
                },
            },
            { status: 200 }
        );
    }

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

    return NextResponse.json(
        {
            comments: commentsWithLikes,
            pagination: {
                currentPage: safePage,
                totalPages,
                hasNextPage: safePage < totalPages,
                hasPreviousPage: safePage > 1,
            },
        },
        { status: 200 }
    );
}

export async function POST(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to comment on blog', code: 401 } },
            { status: 401 }
        );
    }

    const json = await req.json();
    const parsed = BlogCommentSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(parsed.error, { status: 400 });
    }

    const { blogId, content } = parsed.data;

    const blogComment = await prisma.blogComment.create({
        data: {
            content,
            Blog: {
                connect: {
                    id: blogId,
                },
            },
            Author: {
                connect: {
                    email: user.email,
                },
            },
        },
        select: {
            id: true,
        },
    });

    return NextResponse.json(blogComment.id, { status: 201 });
}
