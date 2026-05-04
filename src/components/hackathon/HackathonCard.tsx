"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Trophy, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./CountdownTimer";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HackathonCardProps {
  hackathon: {
    id: string;
    title: string;
    slug: string;
    bannerUrl: string | null;
    registrationDeadline: Date;
    prizePool: number | null;
    location: string;
    isOnline: boolean;
    themes: string[];
    difficulty: string;
    status: string;
  };
  initialBookmark?: boolean;
}

export function HackathonCard({ hackathon, initialBookmark = false }: HackathonCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmark);

  const { data: session } = useSession();
  const router = useRouter();

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please sign in to bookmark hackathons");
      router.push("/login");
      return;
    }

    setIsBookmarked(!isBookmarked);
    // Optimistic UI, call API in background
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const url = isBookmarked ? `/api/bookmarks/${hackathon.id}` : `/api/bookmarks`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: isBookmarked ? undefined : JSON.stringify({ hackathonId: hackathon.id }),
      });
      
      if (!res.ok) throw new Error("Failed to update bookmark");
      toast.success(isBookmarked ? "Removed from bookmarks" : "Hackathon saved!");
    } catch {
      // Revert on error
      setIsBookmarked(isBookmarked);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Link href={`/hackathons/${hackathon.slug}`}>
      <div className="glass-card flex flex-col h-full group relative cursor-pointer">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 glass hover:bg-white/20 text-white rounded-2xl"
          onClick={toggleBookmark}
        >
          <Heart className={cn("h-5 w-5 transition-all duration-300", isBookmarked ? "fill-red-500 text-red-500 scale-110" : "fill-transparent")} />
        </Button>
        
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-violet-600/20 to-indigo-600/20">
          {hackathon.bannerUrl ? (
            <Image 
              src={hackathon.bannerUrl} 
              alt={hackathon.title} 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
               <Trophy className="w-12 h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="font-black text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">{hackathon.title}</h3>
          </div>

          <div className="flex items-center text-sm font-medium text-muted-foreground/80 mb-6">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mr-3">
               <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span className={hackathon.isOnline ? "text-primary font-bold" : ""}>
              {hackathon.isOnline ? "🌍 Remote / Online" : hackathon.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {hackathon.themes.slice(0, 2).map((theme) => (
              <span key={theme} className="px-3 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary">
                {theme}
              </span>
            ))}
            {hackathon.themes.length > 2 && (
              <span className="px-2 py-1 rounded-lg bg-secondary text-[10px] font-bold text-muted-foreground">
                +{hackathon.themes.length - 2}
              </span>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Prize Pool</span>
              <div className="flex items-center font-black text-lg">
                <Trophy className="h-4 w-4 mr-2 text-amber-400" />
                {hackathon.prizePool ? `$${hackathon.prizePool.toLocaleString()}` : 'Custom'}
              </div>
            </div>
            <div className="text-right">
              <CountdownTimer deadline={hackathon.registrationDeadline} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
