import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional().nullable(),
  github: z.string().url().optional().nullable().or(z.literal("")),
  linkedin: z.string().url().optional().nullable().or(z.literal("")),
  skills: z.array(z.string()),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  image: z.string().url().optional().nullable().or(z.literal("")),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = profileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed,
    });

    return NextResponse.json(updatedUser);
  } catch (_error) {
    if (_error instanceof z.ZodError) {
      return NextResponse.json({ error: _error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
