import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { TeamCard } from "@/components/team/TeamCard";
import { Users, LayoutGrid } from "lucide-react";
import { TeamFilters } from "@/components/team/TeamFilters";
import Link from "next/link";

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: { skill?: string; hackathonId?: string };
}) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const teams = await prisma.team.findMany({
    where: {
      isOpen: true,
      ...(searchParams.skill && { 
        neededSkills: { 
          hasSome: [searchParams.skill] 
        } 
      }),
      ...(searchParams.hackathonId && { hackathonId: searchParams.hackathonId }),
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

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Find Your Team
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect with other hackers and build something amazing together.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-end bg-background border p-6 rounded-2xl shadow-sm">
        <TeamFilters />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-violet-600" />
            Open Teams ({teams.length})
          </h2>
        </div>

        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams.map((team) => (
              <div key={team.id} className="group space-y-3">
                <Link 
                  href={`/hackathons/${team.hackathon.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  {team.hackathon.title}
                </Link>
                <TeamCard 
                  team={team} 
                  currentUserId={currentUserId}
                  isAlreadyMember={team.members.some(m => m.userId === currentUserId)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed rounded-3xl bg-muted/10 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">No open teams found</h2>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              We couldn&apos;t find any teams matching your search. Try adjusting your filters or start your own team!
            </p>
            <Link 
              href="/hackathons" 
              className="mt-8 text-violet-600 font-semibold hover:underline"
            >
              Browse Hackathons to Start a Team
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
