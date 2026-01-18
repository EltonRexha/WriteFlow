import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession();
    const email = session?.user?.email;

    if (!email) {
        return NextResponse.json(
            { error: { message: 'user not authenticated', code: 401 } },
            { status: 401 }
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        return NextResponse.json(
            { error: { message: 'user not found', code: 404 } },
            { status: 404 }
        );
    }

    return NextResponse.json(user, { status: 200 });
}
