import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const BLOGS_PER_PAGE = 10;

export async function GET(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to view for you blogs', code: 401 } },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get('page');
    const page = pageParam ? Number(pageParam) : 1;
    const skip = Math.max(0, (page - 1) * BLOGS_PER_PAGE);

    const blogs = await prisma.blog.findMany({
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

    const totalBlogs = await prisma.blog.count();
    const totalPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE);

    return NextResponse.json(
        {
            blogs,
            pagination: {
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        },
        { status: 200 }
    );
}
