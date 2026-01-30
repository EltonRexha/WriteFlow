import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to view your blogs', code: 401 } },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || '';

    if (!title) {
        const latestBlogs = await prisma.blog.findMany({
            where: {
                Author: {
                    email: user.email,
                },
            },
            select: {
                id: true,
                title: true,
                imageUrl: true,
                description: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 3,
        });

        return NextResponse.json(latestBlogs, { status: 200 });
    }

    const blogs = await prisma.blog.findMany({
        where: {
            title: {
                contains: title,
                mode: 'insensitive',
            },
            Author: {
                email: user.email,
            },
        },
        select: {
            id: true,
            title: true,
            imageUrl: true,
            description: true,
            createdAt: true,
        },
        take: 10,
    });

    return NextResponse.json(blogs, { status: 200 });
}
