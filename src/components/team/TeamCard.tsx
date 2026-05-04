"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    bio: string | null;
    isOpen: boolean;
    neededSkills: string[];
    members: {
      user: { name: string | null; image: string | null };
      role: string;
    }[];
  };
  currentUserId?: string | null;
  isAlreadyMember?: boolean;
}

export function TeamCard({ team, currentUserId, isAlreadyMember = false }: TeamCardProps) {
  const [joined, setJoined] = useState(isAlreadyMember);
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${team.id}/join`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Could not join team");
        return;
      }
      setJoined(true);
      toast.success(`Joined "${team.name}"!`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg leading-tight">{team.name}</h3>
          {team.isOpen ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Unlock className="h-3 w-3 mr-1" /> Open
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              <Lock className="h-3 w-3 mr-1" /> Closed
            </Badge>
          )}
        </div>
        {team.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{team.bio}</p>}
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-4">
        <div>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">Members</p>
            <div className="flex -space-x-2">
              {team.members.map((member, i) => (
                <Avatar key={i} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.user.image || undefined} />
                  <AvatarFallback className="text-xs">{member.user.name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          {team.neededSkills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">Looking for</p>
              <div className="flex flex-wrap gap-1">
                {team.neededSkills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-[10px] py-0">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {team.isOpen && (
          <Button
            className="w-full mt-2"
            variant="outline"
            disabled={joined || loading}
            onClick={handleJoin}
          >
            {joined ? "Joined!" : loading ? "Joining..." : "Request to Join"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
