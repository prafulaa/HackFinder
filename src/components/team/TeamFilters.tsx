"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function TeamFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("skill") || "");
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("skill", query);
    } else {
      params.delete("skill");
    }
    router.push(`/teams?${params.toString()}`);
  }, [query, router, searchParams]);

  return (
    <div className="flex-1 w-full space-y-2">
      <label className="text-sm font-medium">Filter by Skill Needed</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search skills (e.g. React, Python, UI/UX)..."
          className="pl-9 h-11 bg-muted/50 border-none focus-visible:ring-violet-600 focus-visible:bg-background transition-all"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}
