import prisma from '@/prisma/client';
import { BlogSchema } from '@/schemas/blogSchema';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user || !user.email) {
        return NextResponse.json(
            { error: { message: 'please login to publish blog', code: 401 } },
            { status: 401 }
        );
    }

    const json = await req.json();
    const parsed = BlogSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(parsed.error, { status: 400 });
    }

    const blogData = parsed.data;

    const existingBlog = await prisma.blog.findFirst({
        where: {
            Author: {
                email: user.email,
            },
            title: blogData.title,
        },
        select: {
            id: true,
        },
    });

    if (existingBlog) {
        return NextResponse.json(
            {
                error: { message: 'draft with this name already exists', code: 400 },
            },
            { status: 400 }
        );
    }

    const categories = await Promise.all(
        blogData.categories.map(async (name) => {
            const category = await prisma.category.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive',
                    },
                },
                select: {
                    id: true,
                },
            });

            if (!category) {
                return null;
            }

            return { id: category.id };
        })
    );

    if (categories.some((c) => c === null)) {
        return NextResponse.json(
            { error: { message: 'category not found', code: 400 } },
            { status: 400 }
        );
    }

    const createdBlog = await prisma.blog.create({
        data: {
            title: blogData.title,
            imageUrl: blogData.imageUrl,
            description: blogData.description,
            Author: {
                connect: {
                    email: user.email,
                },
            },
            BlogContent: {
                create: {
                    content: blogData.content,
                },
            },
            Categories: {
                connect: categories as { id: string }[],
            },
        },
        select: {
            id: true,
        },
    });

    return NextResponse.json(createdBlog.id, { status: 201 });
}
