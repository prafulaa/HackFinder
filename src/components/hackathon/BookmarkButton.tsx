"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  hackathonId: string;
  initialIsBookmarked: boolean;
  authenticated: boolean;
}

export function BookmarkButton({ hackathonId, initialIsBookmarked, authenticated }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleBookmark = async () => {
    if (!authenticated) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isBookmarked) {
        const res = await fetch(`/api/bookmarks/${hackathonId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to remove bookmark");
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hackathonId }),
        });
        if (!res.ok) throw new Error("Failed to add bookmark");
        setIsBookmarked(true);
        toast.success("Hackathon bookmarked!");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "w-full transition-all duration-300",
        isBookmarked && "border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700 text-red-600"
      )}
      onClick={toggleBookmark}
      disabled={isLoading}
    >
      <Heart className={cn(
        "w-4 h-4 mr-2 transition-colors",
        isBookmarked ? "fill-red-500 text-red-500" : "text-muted-foreground"
      )} />
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
