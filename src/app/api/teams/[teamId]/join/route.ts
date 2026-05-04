import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: { teamId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = params;
  const userId = session.user.id;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }
  if (!team.isOpen) {
    return NextResponse.json({ error: "Team is not accepting members" }, { status: 400 });
  }

  const alreadyMember = team.members.some(m => m.userId === userId);
  if (alreadyMember) {
    return NextResponse.json({ error: "Already a member" }, { status: 400 });
  }

  await prisma.teamMember.create({
    data: { teamId, userId, role: "member" },
  });

  await prisma.notification.create({
    data: {
      userId: team.ownerId,
      type: "team_join",
      title: "New team member",
      body: `Someone joined your team "${team.name}".`,
      link: `/hackathons`,
    },
  });

  return NextResponse.json({ success: true });
}
