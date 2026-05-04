import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hackathonId } = await req.json();

    if (!hackathonId) {
      return NextResponse.json({ error: "hackathonId is required" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        hackathonId,
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: "Already bookmarked" }, { status: 400 });
    }
    console.error("Bookmark error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
