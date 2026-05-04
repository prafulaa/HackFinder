"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
  github: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  skills: z.array(z.string()),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  image: z.string().url().optional().nullable().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    bio: string | null;
    github: string | null;
    linkedin: string | null;
    skills: string[];
    experienceLevel: string;
    image: string | null;
  };
  onSuccess?: () => void;
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const router = useRouter();
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      skills: user.skills || [],
      experienceLevel: (user.experienceLevel as "beginner" | "intermediate" | "advanced") || "beginner",
      image: user.image || "",
    },
  });


  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!");
      if (onSuccess) onSuccess();
      router.refresh();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const currentSkills = form.getValues("skills");
      if (!currentSkills.includes(skillInput.trim())) {
        form.setValue("skills", [...currentSkills, skillInput.trim()], { shouldDirty: true });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const currentSkills = form.getValues("skills");
    form.setValue("skills", currentSkills.filter((s) => s !== skill), { shouldDirty: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden border">
            {form.watch("image") ? (
              <Image src={form.watch("image")!} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <FormLabel>Profile Picture</FormLabel>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                form.setValue("image", res[0].url, { shouldDirty: true });
                toast.success("Image uploaded!");
              }}
              onUploadError={(error: Error) => {
                toast.error(`ERROR! ${error.message}`);
              }}
              appearance={{
                button: "bg-violet-600 hover:bg-violet-700 text-sm h-9",
                allowedContent: "hidden"
              }}
            />
          </div>
        </div>

        <FormField

          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself..." 
                  className="resize-none h-24" 
                  {...field} 
                  value={field.value || ""} 
                />
              </FormControl>
              <FormDescription>Max 500 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/username" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Skills</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
            {form.watch("skills").map((skill) => (
              <Badge key={skill} variant="secondary" className="pl-2 py-1 flex items-center gap-1">
                {skill}
                <button 
                  type="button" 
                  onClick={() => removeSkill(skill)} 
                  className="rounded-full hover:bg-muted p-0.5"
                  aria-label={`Remove ${skill} skill`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add a skill (e.g. React) and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
          />
        </div>

        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
