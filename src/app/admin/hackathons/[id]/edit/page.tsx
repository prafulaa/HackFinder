import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { HackathonForm } from "@/components/admin/HackathonForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditHackathonPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true }
  });

  if (user?.role !== "admin") {
    redirect("/");
  }

  const hackathon = await prisma.hackathon.findUnique({
    where: { id: params.id }
  });

  if (!hackathon) notFound();

  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <div className="space-y-1">
        <Link href="/admin/hackathons" className="text-sm text-muted-foreground hover:text-violet-600 flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3 h-3" /> Back to List
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Hackathon</h1>
        <p className="text-muted-foreground">
          Updating: <span className="font-semibold text-foreground">{hackathon.title}</span>
        </p>
      </div>

      <div className="bg-background border rounded-2xl p-8 shadow-sm">
        <HackathonForm 
          initialData={{
            ...hackathon,
            startDate: hackathon.startDate.toISOString().split('T')[0],
            endDate: hackathon.endDate.toISOString().split('T')[0],
            registrationDeadline: hackathon.registrationDeadline.toISOString().split('T')[0],
            difficulty: hackathon.difficulty as "beginner" | "intermediate" | "advanced",
            status: hackathon.status as "upcoming" | "ongoing" | "ended",
            bannerUrl: hackathon.bannerUrl || "",
            prizePool: hackathon.prizePool || 0,
          }} 
          isEdit 
        />
      </div>
    </div>
  );
}
