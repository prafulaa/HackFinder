import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// prisma is imported from @/lib/prisma

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch bookmarked hackathons
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: { hackathon: true },
  });

  const bookmarkedHackathons = bookmarks.map(b => b.hackathon);

  // Sort by deadline
  const upcomingDeadlines = [...bookmarkedHackathons]
    .filter(h => new Date(h.registrationDeadline) > new Date())
    .sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime())
    .slice(0, 3);

  // Fetch user's teams
  const teamMemberships = await prisma.teamMember.findMany({
    where: { userId },
    include: { team: { include: { hackathon: true } } }
  });

  const teams = teamMemberships.map(tm => tm.team);

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name || 'Hacker'}!</h1>
        <p className="text-muted-foreground">Here is an overview of your hackathon journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookmarks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Trophy className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 bg-violet-50/50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-violet-600" /> Action Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map(h => {
                  const days = Math.ceil((new Date(h.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  let urgencyClass = "bg-green-100 text-green-800";
                  if (days <= 3) urgencyClass = "bg-red-100 text-red-800";
                  else if (days <= 7) urgencyClass = "bg-amber-100 text-amber-800";

                  return (
                    <div key={h.id} className="flex items-center justify-between">
                      <span className="font-medium text-sm">{h.title}</span>
                      <Badge variant="outline" className={urgencyClass}>
                        Closes in {days} days
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No immediate deadlines approaching. You&apos;re all caught up!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Bookmarks</h2>
            <a href="/dashboard/bookmarks" className="text-sm text-violet-600 hover:underline">View all</a>
          </div>
          {bookmarkedHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bookmarkedHackathons.slice(0, 3).map(h => (
                <Card key={h.id} className="p-4 flex flex-col items-center justify-center border-dashed text-center hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold">{h.title}</h3>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-12 border rounded-xl bg-background border-dashed">
              <Target className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-1">No bookmarks yet</h4>
              <p className="text-sm text-muted-foreground">Save hackathons you&apos;re interested in to track them here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
