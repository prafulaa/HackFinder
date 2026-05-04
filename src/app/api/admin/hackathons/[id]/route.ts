import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const hackathonSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().min(10),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.string(),
  endDate: z.string(),
  registrationDeadline: z.string(),
  prizePool: z.number().optional(),
  location: z.string().min(2),
  isOnline: z.boolean().default(false),
  websiteUrl: z.string().url(),
  registrationUrl: z.string().url(),
  themes: z.array(z.string()).min(1),

  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  status: z.enum(["upcoming", "ongoing", "ended"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true }
  });

  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = hackathonSchema.parse(body);

    const hackathon = await prisma.hackathon.update({
      where: { id: params.id },
      data: {
        ...parsed,
        startDate: new Date(parsed.startDate),
        endDate: new Date(parsed.endDate),
        registrationDeadline: new Date(parsed.registrationDeadline),
      },
    });

    return NextResponse.json(hackathon);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true }
  });

  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.hackathon.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (_error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
