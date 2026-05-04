import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const skill = searchParams.get("skill");
  const hackathonId = searchParams.get("hackathonId");

  const teams = await prisma.team.findMany({
    where: {
      isOpen: true,
      ...(skill && { neededSkills: { has: skill } }),
      ...(hackathonId && { hackathonId }),
    },
    include: {
      hackathon: true,
      owner: true,
      members: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(teams);
}


const createTeamSchema = z.object({
  name: z.string().min(1).max(80),
  bio: z.string().max(300).optional(),
  neededSkills: z.array(z.string()).optional(),
  hackathonId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createTeamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, bio, neededSkills, hackathonId } = parsed.data;

  const team = await prisma.team.create({
    data: {
      name,
      bio: bio ?? null,
      neededSkills: neededSkills ?? [],
      hackathonId,
      ownerId: session.user.id,
      members: {
        create: { userId: session.user.id, role: "owner" },
      },
    },
    include: {
      members: { include: { user: true } },
    },
  });

  return NextResponse.json(team, { status: 201 });
}
