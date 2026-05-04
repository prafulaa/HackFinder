"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";

const THEMES = ["AI", "HealthTech", "Web3", "Social Impact", "FinTech", "EdTech", "GameDev", "ClimaTech"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced", "all"];
const STATUSES = ["upcoming", "ongoing", "ended"];

export function HackathonFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 300)[0];



  const updateQuery = useCallback((key: string, value: string | string[] | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach(v => params.append(key, v));
    } else {
      params.set(key, value);
    }
    params.set("page", "1"); // Reset pagination
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    updateQuery("search", debouncedSearch);
  }, [debouncedSearch, updateQuery]);

  const getArrayParam = (key: string) => searchParams.getAll(key);

  const toggleArrayParam = (key: string, value: string) => {
    const current = getArrayParam(key);
    if (current.includes(value)) {
      updateQuery(key, current.filter(v => v !== value));
    } else {
      updateQuery(key, [...current, value]);
    }
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
    setSearch("");
  };

  const activeFiltersCount = Array.from(searchParams.keys()).filter(k => k !== "page" && k !== "sort").length;

  return (
    <div className="space-y-6 bg-muted/20 p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="rounded-full px-2 py-0">
              {activeFiltersCount}
            </Badge>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-3">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search keywords..." 
            className="pl-8" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <Label>Sort By</Label>
        <Select 
          value={searchParams.get("sort") || "deadline"} 
          onValueChange={(val) => updateQuery("sort", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
            <SelectItem value="newest">Newest Added</SelectItem>
            <SelectItem value="prize">Prize Pool (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <Label>Status</Label>
        <Select 
          value={searchParams.get("status") || "all"} 
          onValueChange={(val) => updateQuery("status", val === "all" ? null : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label>Location</Label>
        <Select 
          value={searchParams.get("isOnline") || "all"} 
          onValueChange={(val) => updateQuery("isOnline", val === "all" ? null : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Anywhere</SelectItem>
            <SelectItem value="true">Online Only</SelectItem>
            <SelectItem value="false">In-Person Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Themes */}
      <div className="space-y-3">
        <Label>Themes</Label>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((theme) => {
            const isActive = getArrayParam("themes").includes(theme);
            return (
              <div key={theme} className="flex items-center space-x-2">
                <Checkbox 
                  id={`theme-${theme}`} 
                  checked={isActive}
                  onCheckedChange={() => toggleArrayParam("themes", theme)}
                />
                <label 
                  htmlFor={`theme-${theme}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {theme}
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-3">
        <Label>Difficulty</Label>
        <div className="grid grid-cols-2 gap-2">
          {DIFFICULTIES.map((diff) => {
            const isActive = getArrayParam("difficulty").includes(diff);
            return (
              <div key={diff} className="flex items-center space-x-2">
                <Checkbox 
                  id={`diff-${diff}`} 
                  checked={isActive}
                  onCheckedChange={() => toggleArrayParam("difficulty", diff)}
                />
                <label 
                  htmlFor={`diff-${diff}`}
                  className="text-sm font-medium leading-none capitalize cursor-pointer"
                >
                  {diff}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
