import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { generateText, JSONContent } from '@tiptap/core';
import { TIP_TAP_EXTENSIONS } from '@/libs/TipTapExtensions';
import { z } from 'zod';

const UpdateBlogContentSchema = z.object({
    content: z.string().nonempty('Content is required'),
});

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    const user = session?.user;

    const { id } = await params;

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
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to delete your blog', code: 401 } },
            { status: 401 }
        );
    }

    const { id } = await params;

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

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to update your blog', code: 401 } },
            { status: 401 }
        );
    }

    const { id } = await params;
    const json = await req.json();

    // Validate the request body
    const parsed = UpdateBlogContentSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            { error: { message: 'invalid content format', code: 400 } },
            { status: 400 }
        );
    }

    // Parse and validate TipTap JSON content
    let blogContentMetaData: JSONContent;
    try {
        blogContentMetaData = JSON.parse(parsed.data.content) as JSONContent;
    } catch {
        return NextResponse.json(
            { error: { message: 'invalid JSON content format', code: 400 } },
            { status: 400 }
        );
    }

    // Validate content length
    const blogContentText = generateText(blogContentMetaData, TIP_TAP_EXTENSIONS);
    if (blogContentText.length < 50) {
        return NextResponse.json(
            { error: { message: 'blog content must be at least 50 characters long', code: 400 } },
            { status: 400 }
        );
    }

    // Check if blog exists and belongs to the user
    const blog = await prisma.blog.findFirst({
        where: {
            id,
            Author: {
                email: user.email,
            },
        },
        select: {
            id: true,
            BlogContent: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!blog) {
        return NextResponse.json(
            {
                error: {
                    message: 'could not find this blog, or does not belong to you',
                    code: 404,
                },
            },
            { status: 404 }
        );
    }

    // Update the blog content
    await prisma.blogContent.update({
        where: {
            id: blog.BlogContent?.id,
        },
        data: {
            content: parsed.data.content,
        },
    });

    return NextResponse.json(
        { message: 'successfully updated blog content', code: 200 },
        { status: 200 }
    );
}
