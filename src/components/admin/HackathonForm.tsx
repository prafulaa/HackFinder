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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";


const hackathonSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  description: z.string().min(10),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.string(),
  endDate: z.string(),
  registrationDeadline: z.string(),
  prizePool: z.number().min(0).optional(),
  location: z.string().min(2),
  isOnline: z.boolean(),
  websiteUrl: z.string().url(),
  registrationUrl: z.string().url(),
  themes: z.array(z.string()).min(1, "Select at least one theme"),

  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  status: z.enum(["upcoming", "ongoing", "ended"]),
});

type HackathonFormValues = z.infer<typeof hackathonSchema>;

interface HackathonFormProps {
  initialData?: HackathonFormValues & { id: string };
  isEdit?: boolean;
}

export function HackathonForm({ initialData, isEdit }: HackathonFormProps) {
  const router = useRouter();
  const [themeInput, setThemeInput] = useState("");

  const form = useForm<HackathonFormValues>({
    resolver: zodResolver(hackathonSchema),
    defaultValues: initialData ? {
      ...initialData,
      startDate: new Date(initialData.startDate).toISOString().split('T')[0],
      endDate: new Date(initialData.endDate).toISOString().split('T')[0],
      registrationDeadline: new Date(initialData.registrationDeadline).toISOString().split('T')[0],
      prizePool: initialData.prizePool || 0,
      registrationUrl: initialData.registrationUrl || "",
    } : {
      title: "",
      slug: "",
      description: "",
      bannerUrl: "",
      startDate: "",
      endDate: "",
      registrationDeadline: "",
      prizePool: 0,
      location: "",
      isOnline: false,
      websiteUrl: "",
      registrationUrl: "",
      themes: [],
      difficulty: "intermediate",
      status: "upcoming",
    },

  });

  const onSubmit = async (values: HackathonFormValues) => {
    try {
      const url = (isEdit && initialData) ? `/api/admin/hackathons/${initialData.id}` : "/api/admin/hackathons";
      const method = isEdit ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save hackathon");

      toast.success(isEdit ? "Hackathon updated!" : "Hackathon created!");
      router.push("/admin/hackathons");
      router.refresh();
    } catch {
      toast.error("Failed to save hackathon");
    }
  };

  const addTheme = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && themeInput.trim()) {
      e.preventDefault();
      const current = form.getValues("themes");
      if (!current.includes(themeInput.trim())) {
        form.setValue("themes", [...current, themeInput.trim()]);
      }
      setThemeInput("");
    }
  };

  const removeTheme = (theme: string) => {
    const current = form.getValues("themes");
    form.setValue("themes", current.filter((t) => t !== theme));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Global AI Hackathon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="global-ai-hackathon" {...field} />
                </FormControl>
                <FormDescription>Unique URL identifier.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the hackathon..." className="h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Deadline</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country or Online" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isOnline"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Online Event</FormLabel>
                  <FormDescription>Is this hackathon fully virtual?</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription>Where hackers should register.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bannerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image</FormLabel>
                <div className="flex flex-col gap-4">
                  {field.value && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                      <Image src={field.value} alt="Banner Preview" fill className="object-cover" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => field.onChange("")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <FormControl>
                    <UploadButton
                      endpoint="bannerUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                        toast.success("Banner uploaded!");
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`ERROR! ${error.message}`);
                      }}
                      appearance={{
                        button: "bg-violet-600 hover:bg-violet-700 text-sm",
                        allowedContent: "text-xs"
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="prizePool"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prize Pool ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
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

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Themes</FormLabel>
          <div className="flex flex-wrap gap-2">
            {form.watch("themes").map((theme) => (
              <Badge key={theme} variant="secondary" className="flex items-center gap-1 py-1.5 px-3">
                {theme}
                <X className="w-3 h-3 cursor-pointer" onClick={() => removeTheme(theme)} />
              </Badge>
            ))}
          </div>
          <Input 
            placeholder="Add theme (e.g. AI, Web3) and press Enter" 
            value={themeInput}
            onChange={e => setThemeInput(e.target.value)}
            onKeyDown={addTheme}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700 px-8">
            {isEdit ? "Update Hackathon" : "Create Hackathon"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
