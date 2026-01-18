import { NextResponse } from 'next/server';
import { UserSchema } from '@/schemas/userSchema';
import bcrypt from 'bcrypt';
import prisma from '@/prisma/client';

export async function POST(request: Request) {
  const jsonBody = await request.json();
  const body = UserSchema.safeParse(jsonBody);

  if (!body.success) {
    return NextResponse.json(body.error, { status: 400 });
  }

  const { email, name, password, image } = body.data;

  //If user exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return NextResponse.json(
      { message: 'a user with this email already exists' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      image,
    },
  });

  return NextResponse.json(
    {
      message: 'User successfully created',
      email: createdUser.email,
    },
    {
      status: 201,
    }
  );
}
