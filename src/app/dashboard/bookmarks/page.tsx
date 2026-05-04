import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { HackathonCard } from "@/components/hackathon/HackathonCard";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: { 
      hackathon: true 
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const bookmarkedHackathons = bookmarks.map(b => b.hackathon);

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-violet-600 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" /> My Bookmarks
          </h1>
          <p className="text-muted-foreground">
            You have saved {bookmarkedHackathons.length} hackathon{bookmarkedHackathons.length !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      {bookmarkedHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedHackathons.map((hackathon) => (
            <HackathonCard 
              key={hackathon.id} 
              hackathon={hackathon} 
              initialBookmark={true} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/20">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No bookmarks yet</h2>
              <p className="text-muted-foreground">
                Find hackathons that interest you and click the heart icon to save them for later.
              </p>
            </div>
            <Button asChild className="bg-violet-600 hover:bg-violet-700">
              <Link href="/hackathons">Browse Hackathons</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
