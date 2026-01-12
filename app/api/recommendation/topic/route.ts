import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const BLOGS_PER_PAGE = 10;

export async function GET(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to view blogs by topic', code: 401 } },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const pageParam = searchParams.get('page');
    const page = pageParam ? Number(pageParam) : 1;

    if (!topic) {
        return NextResponse.json(
            { error: { message: 'topic is required', code: 400 } },
            { status: 400 }
        );
    }

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const skip = (safePage - 1) * BLOGS_PER_PAGE;

    const blogs = await prisma.blog.findMany({
        where: {
            Categories: {
                some: {
                    name: topic,
                },
            },
        },
        orderBy: [
            {
                likedBy: {
                    _count: 'desc',
                },
            },
            {
                viewedBy: {
                    _count: 'desc',
                },
            },
        ],
        take: BLOGS_PER_PAGE,
        skip,
        select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            createdAt: true,
            Author: {
                select: {
                    name: true,
                    image: true,
                },
            },
            _count: {
                select: {
                    likedBy: true,
                    dislikedBy: true,
                    viewedBy: true,
                },
            },
        },
    });

    const totalBlogs = await prisma.blog.count({
        where: {
            Categories: {
                some: {
                    name: topic,
                },
            },
        },
    });

    const totalPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE);

    return NextResponse.json(
        {
            blogs,
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
