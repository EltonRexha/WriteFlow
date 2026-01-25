import prisma from "@/prisma/client";
import { DraftSchema } from "@/schemas/draftSchema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json(
      { error: { message: "please login to view drafts", code: 401 } },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const draftId = searchParams.get("id");

  // If ID is provided, return single draft
  if (draftId) {
    try {
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
              content: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!draft) {
        return NextResponse.json(
          { error: { message: "draft not found", code: 404 } },
          { status: 404 },
        );
      }

      return NextResponse.json(draft);
    } catch {
      return NextResponse.json(
        { error: { message: "failed to fetch draft", code: 500 } },
        { status: 500 },
      );
    }
  }

  // Otherwise, return paginated list
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const [drafts, totalCount] = await Promise.all([
      prisma.draft.findMany({
        where: {
          Author: {
            email: user.email,
          },
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.draft.count({
        where: {
          Author: {
            email: user.email,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      drafts,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        totalCount,
      },
    });
  } catch {
    return NextResponse.json(
      { error: { message: "failed to fetch drafts", code: 500 } },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json(
      { error: { message: "please login to delete drafts", code: 401 } },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const draftId = searchParams.get("id");

  if (!draftId) {
    return NextResponse.json(
      { error: { message: "draft id is required", code: 400 } },
      { status: 400 },
    );
  }

  try {
    const draft = await prisma.draft.findFirst({
      where: {
        id: draftId,
        Author: {
          email: user.email,
        },
      },
    });

    if (!draft) {
      return NextResponse.json(
        { error: { message: "draft not found", code: 404 } },
        { status: 404 },
      );
    }

    await prisma.draft.delete({
      where: {
        id: draftId,
      },
    });

    return NextResponse.json({ message: "draft deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: { message: "failed to delete draft", code: 500 } },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json(
      { error: { message: "please login to save draft", code: 401 } },
      { status: 401 },
    );
  }

  const json = await req.json();
  const parsed = DraftSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, { status: 400 });
  }

  const draftData = parsed.data;

  const existingDraft = await prisma.draft.findFirst({
    where: {
      Author: {
        email: user.email,
      },
      name: draftData.name,
    },
    select: {
      id: true,
    },
  });

  if (existingDraft) {
    return NextResponse.json(
      { error: { message: "draft with this name already exists", code: 400 } },
      { status: 400 },
    );
  }

  const createdDraft = await prisma.draft.create({
    data: {
      name: draftData.name,
      Author: {
        connect: {
          email: user.email,
        },
      },
      BlogContent: {
        create: {
          content: draftData.content,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json(createdDraft.id, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json(
      { error: { message: "please login to update draft", code: 401 } },
      { status: 401 },
    );
  }

  const json = await req.json();
  const { id: draftId, content } = json;

  if (!draftId || !content) {
    return NextResponse.json(
      { error: { message: "draft id and content are required", code: 400 } },
      { status: 400 },
    );
  }

  try {
    const draft = await prisma.draft.findFirst({
      where: {
        id: draftId,
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

    if (!draft) {
      return NextResponse.json(
        { error: { message: "draft not found", code: 404 } },
        { status: 404 },
      );
    }

    await prisma.blogContent.update({
      where: {
        id: draft.BlogContent.id,
      },
      data: {
        content,
      },
    });

    await prisma.draft.update({
      where: {
        id: draftId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "draft updated successfully", code: 200 },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: { message: "failed to update draft", code: 500 } },
      { status: 500 },
    );
  }
}
