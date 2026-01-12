import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession();
    const email = session?.user?.email;

    if (!email) {
        return NextResponse.json(
            { error: { message: 'Please login to check if you follow user', code: 401 } },
            { status: 401 }
        );
    }

    const { id } = params;

    const isFollowed = !!(await prisma.user.findFirst({
        where: {
            id,
            FollowedBy: {
                some: {
                    email,
                },
            },
        },
    }));

    return NextResponse.json(isFollowed, { status: 200 });
}

export async function POST(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession();
    const email = session?.user?.email;

    if (!email) {
        return NextResponse.json(
            { error: { message: 'Please login to follow user', code: 401 } },
            { status: 401 }
        );
    }

    const { id } = params;

    await prisma.user.update({
        where: {
            email,
        },
        data: {
            Follows: {
                connect: {
                    id,
                },
            },
        },
    });

    return NextResponse.json({ message: 'successfully followed user' }, { status: 200 });
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession();
    const email = session?.user?.email;

    if (!email) {
        return NextResponse.json(
            { error: { message: 'Please login to follow user', code: 401 } },
            { status: 401 }
        );
    }

    const { id } = params;

    await prisma.user.update({
        where: {
            email,
        },
        data: {
            Follows: {
                disconnect: {
                    id,
                },
            },
        },
    });

    return NextResponse.json(
        { message: 'successfully unfollowed user' },
        { status: 200 }
    );
}
