import { TIP_TAP_EXTENSIONS } from '@/libs/TipTapExtensions';
import prisma from '@/prisma/client';
import { BlogSchemaForm } from '@/schemas/blogSchema';
import { generateText, JSONContent } from '@tiptap/core';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.email) {
        return NextResponse.json(
            { error: { message: 'please login to publish draft', code: 401 } },
            { status: 401 }
        );
    }

    const { id: draftId } = await params;
    const json = await req.json();

    // Validate blog metadata (title, description, categories, imageUrl)
    const parsed = BlogSchemaForm.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(parsed.error, { status: 400 });
    }

    try {
        // Get the draft and verify ownership
        const draft = await prisma.draft.findFirst({
            where: {
                id: draftId,
                Author: {
                    email: user.email,
                },
            },
            select: {
                id: true,
                name: true,
                BlogContent: {
                    select: {
                        id: true,
                        content: true,
                    },
                },
            },
        });

        if (!draft) {
            return NextResponse.json(
                { error: { message: 'draft not found', code: 404 } },
                { status: 404 }
            );
        }

        // Validate content
        let blogContentMetaData: JSONContent;
        try {
            blogContentMetaData = JSON.parse(
                draft.BlogContent.content as string
            ) as JSONContent;
        } catch {
            return NextResponse.json(
                { error: { message: 'invalid content format', code: 400 } },
                { status: 400 }
            );
        }

        const blogContentText = generateText(blogContentMetaData, TIP_TAP_EXTENSIONS);
        if (blogContentText.length < 50) {
            return NextResponse.json(
                {
                    error: {
                        message: 'blog content must be at least 50 characters long',
                        code: 400,
                    },
                },
                { status: 400 }
            );
        }

        // Check if blog with same title already exists
        const existingBlog = await prisma.blog.findFirst({
            where: {
                Author: {
                    email: user.email,
                },
                title: parsed.data.title,
            },
            select: {
                id: true,
            },
        });

        if (existingBlog) {
            return NextResponse.json(
                {
                    error: { message: 'blog with this title already exists', code: 400 },
                },
                { status: 400 }
            );
        }

        // Get categories
        const categories = await Promise.all(
            parsed.data.categories.map(async (name) => {
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

        // Create the blog using the draft's content
        const createdBlog = await prisma.blog.create({
            data: {
                title: parsed.data.title,
                imageUrl: parsed.data.imageUrl,
                description: parsed.data.description,
                Author: {
                    connect: {
                        email: user.email,
                    },
                },
                BlogContent: {
                    connect: {
                        id: draft.BlogContent.id,
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

        // Delete the draft (but keep the BlogContent as it's now used by the blog)
        await prisma.draft.delete({
            where: {
                id: draftId,
            },
        });

        return NextResponse.json(createdBlog.id, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: { message: 'failed to publish draft', code: 500 } },
            { status: 500 }
        );
    }
}
