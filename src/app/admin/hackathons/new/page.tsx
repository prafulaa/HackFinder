import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HackathonForm } from "@/components/admin/HackathonForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewHackathonPage() {
  const session = await auth();
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true }
  });

  if (user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <div className="space-y-1">
        <Link href="/admin/hackathons" className="text-sm text-muted-foreground hover:text-violet-600 flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3 h-3" /> Back to List
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Hackathon</h1>
        <p className="text-muted-foreground">
          Fill in the details below to add a new hackathon to the platform.
        </p>
      </div>

      <div className="bg-background border rounded-2xl p-8 shadow-sm">
        <HackathonForm />
      </div>
    </div>
  );
}
