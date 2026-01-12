import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const BLOGS_PER_PAGE = 10;

export async function GET(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user || !user.email) {
        return NextResponse.json(
            { error: { message: 'please login to view user blogs', code: 401 } },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const pageParam = searchParams.get('page');
    const page = pageParam ? Number(pageParam) : 1;

    if (!email) {
        return NextResponse.json(
            { error: { message: 'email is required', code: 400 } },
            { status: 400 }
        );
    }

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const skip = (safePage - 1) * BLOGS_PER_PAGE;

    const blogs = await prisma.blog.findMany({
        where: {
            Author: {
                email,
            },
        },
        orderBy: [
            {
                createdAt: 'desc',
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
            _count: {
                select: {
                    likedBy: true,
                    dislikedBy: true,
                    viewedBy: true,
                },
            },
            Author: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });

    const totalBlogs = await prisma.blog.count({
        where: {
            Author: {
                email,
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
