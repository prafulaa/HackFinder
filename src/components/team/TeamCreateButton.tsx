"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface TeamCreateButtonProps {
  hackathonId: string;
  variant?: "outline" | "default";
  label?: string;
}

export function TeamCreateButton({ hackathonId, variant = "outline", label = "Create a Team" }: TeamCreateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const neededSkills = skillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), bio: bio.trim() || undefined, neededSkills, hackathonId }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Failed to create team");
        return;
      }

      toast.success("Team created!");
      setOpen(false);
      setName("");
      setBio("");
      setSkillsInput("");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a Team</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name *</Label>
              <Input
                id="team-name"
                placeholder="AI Wizards"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-bio">Description</Label>
              <Textarea
                id="team-bio"
                placeholder="What are you building?"
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-skills">Skills Needed</Label>
              <Input
                id="team-skills"
                placeholder="Frontend, Design, ML (comma-separated)"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
              />
            </div>
            <DialogFooter showCloseButton>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={loading}>
                {loading ? "Creating..." : "Create Team"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
