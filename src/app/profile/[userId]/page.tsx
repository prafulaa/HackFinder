import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Calendar, Edit3, ExternalLink } from "lucide-react";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { ProfileForm } from "@/components/profile/ProfileForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookmarks: {
        include: { hackathon: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      teamMembers: {
        include: {
          team: {
            include: { hackathon: true },
          },
        },
        take: 5,
        orderBy: { joinedAt: "desc" },
      },
    },
  });

  if (!user) notFound();
  return user;
}

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const user = await getUser(params.userId);
  const session = await auth();
  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-background border rounded-2xl p-8 shadow-sm">
        <Avatar className="w-32 h-32 border-4 border-muted">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback className="text-4xl bg-violet-100 text-violet-700">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
            
            {isOwnProfile && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your personal information and skills.
                    </DialogDescription>
                  </DialogHeader>
                  <ProfileForm user={user} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 capitalize">
              {user.experienceLevel}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1 px-2">
              <Calendar className="w-4 h-4" /> Joined {format(user.createdAt, 'MMM yyyy')}
            </span>
          </div>
          
          {user.bio && (
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {user.bio}
            </p>
          )}
          
          <div className="flex gap-4">
            {user.github && (
              <a href={user.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors" aria-label="GitHub Profile">
                <GitHubLogoIcon className="w-5 h-5" />
              </a>
            )}
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors" aria-label="LinkedIn Profile">
                <LinkedInLogoIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar - Skills */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Activity */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-4">Recent Hackathons</h3>
            <div className="space-y-4">
              {user.teamMembers.length > 0 ? (
                user.teamMembers.map(({ team, id }) => (
                  <Card key={id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{team.hackathon.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Team: <span className="font-medium text-foreground">{team.name}</span>
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/hackathons/${team.hackathon.slug}`}>
                            View <ExternalLink className="w-3 h-3 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed">
                  <p className="text-muted-foreground">Haven&apos;t joined any hackathons yet.</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">Saved Hackathons</h3>
            <div className="space-y-4">
              {user.bookmarks.length > 0 ? (
                user.bookmarks.map(({ hackathon, id }) => (
                  <Card key={id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{hackathon.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {hackathon.description}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/hackathons/${hackathon.slug}`}>
                            View <ExternalLink className="w-3 h-3 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed">
                  <p className="text-muted-foreground">No bookmarked hackathons.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
