import { HackathonCard } from "./HackathonCard";

interface HackathonGridProps {
  hackathons: { id: string; title: string; slug: string; bannerUrl: string | null; registrationDeadline: Date; prizePool: number | null; location: string; isOnline: boolean; themes: string[]; difficulty: string; status: string; }[];
  userBookmarks?: string[];
}

export function HackathonGrid({ hackathons, userBookmarks = [] }: HackathonGridProps) {
  if (!hackathons || hackathons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10 border-dashed">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold">No hackathons found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          We couldn&apos;t find any hackathons matching your current filters. Try adjusting your search or clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {hackathons.map((hackathon) => (
        <HackathonCard 
          key={hackathon.id} 
          hackathon={hackathon} 
          initialBookmark={userBookmarks.includes(hackathon.id)} 
        />
      ))}
    </div>
  );
}
