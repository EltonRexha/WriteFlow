import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
      },
    });
    const topics = [{ name: 'For-You' }, { name: 'Following' }, ...categories];
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}
