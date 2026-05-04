import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { hackathonId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hackathonId } = params;

    await prisma.bookmark.delete({
      where: {
        userId_hackathonId: {
          userId: session.user.id,
          hackathonId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (_error) {
    console.error("Bookmark deletion error:", _error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
