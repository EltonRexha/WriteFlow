import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession();
    const user = session?.user;

    const { id } = params;

    const blog = await prisma.blog.findFirst({
        where: {
            id,
        },
        select: {
            Author: {
                select: {
                    email: true,
                    image: true,
                    name: true,
                },
            },
            BlogContent: {
                select: {
                    content: true,
                },
            },
            Categories: {
                select: {
                    name: true,
                },
            },
            title: true,
            description: true,
            id: true,
            imageUrl: true,
            createdAt: true,
            _count: {
                select: {
                    likedBy: true,
                    dislikedBy: true,
                    viewedBy: true,
                },
            },
        },
    });

    if (!blog) {
        return NextResponse.json(
            { error: { message: 'blog not found', code: 404 } },
            { status: 404 }
        );
    }

    if (!user?.email) {
        return NextResponse.json({ data: blog }, { status: 200 });
    }

    const isLiked =
        !!(await prisma.blog.findFirst({
            where: {
                id,
                likedBy: {
                    some: {
                        email: user.email,
                    },
                },
            },
            select: { id: true },
        }));

    const isDisliked =
        !!(await prisma.blog.findFirst({
            where: {
                id,
                dislikedBy: {
                    some: {
                        email: user.email,
                    },
                },
            },
            select: { id: true },
        }));

    return NextResponse.json({ data: blog, isLiked, isDisliked }, { status: 200 });
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to delete your blog', code: 401 } },
            { status: 401 }
        );
    }

    const { id } = params;

    const blog = await prisma.blog.findFirst({
        where: {
            id,
            Author: {
                email: user.email,
            },
        },
        select: { id: true },
    });

    if (!blog) {
        return NextResponse.json(
            {
                error: {
                    message: 'could not find this blog, or does not belong to you',
                    code: 400,
                },
            },
            { status: 400 }
        );
    }

    await prisma.blog.delete({
        where: {
            id,
        },
    });

    return NextResponse.json(
        { message: 'successfully deleted blog', code: 200 },
        { status: 200 }
    );
}
