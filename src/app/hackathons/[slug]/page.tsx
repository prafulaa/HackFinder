import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Trophy, Calendar, Users, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamCard } from "@/components/team/TeamCard";
import { TeamCreateButton } from "@/components/team/TeamCreateButton";
import { CountdownTimer } from "@/components/hackathon/CountdownTimer";
import { MarkdownViewer } from "@/components/hackathon/MarkdownViewer";
import { format } from "date-fns";
import dynamic from "next/dynamic";

const HackathonMap = dynamic(() => import("@/components/hackathon/HackathonMap"), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-muted animate-pulse rounded-xl" />
});

import { BookmarkButton } from "@/components/hackathon/BookmarkButton";

async function getHackathonDetails(slug: string, userId: string | null) {
  const hackathon = await prisma.hackathon.findUnique({
    where: { slug },
    include: {
      teams: {
        include: {
          members: {
            include: { user: true },
          },
        },
      },
      bookmarks: userId ? {
        where: { userId }
      } : false,
    },
  });

  if (!hackathon) notFound();
  return hackathon;
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const hackathon = await prisma.hackathon.findUnique({
    where: { slug: params.slug },
  });

  if (!hackathon) {
    return {
      title: "Hackathon Not Found | HackFinder",
    };
  }

  return {
    title: `${hackathon.title} | HackFinder`,
    description: hackathon.description.substring(0, 160),
    openGraph: {
      title: hackathon.title,
      description: hackathon.description.substring(0, 160),
      images: hackathon.bannerUrl ? [hackathon.bannerUrl] : [],
    },
  };
}


export default async function HackathonDetailPage({ params }: { params: { slug: string } }) {
  const session = await auth();
  const currentUserId = session?.user?.id ?? null;
  const hackathon = await getHackathonDetails(params.slug, currentUserId);
  
  const isBookmarked = hackathon.bookmarks && hackathon.bookmarks.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": hackathon.title,
    "description": hackathon.description,
    "image": hackathon.bannerUrl,
    "startDate": hackathon.startDate,
    "endDate": hackathon.endDate,
    "eventAttendanceMode": hackathon.isOnline ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": hackathon.isOnline ? {
      "@type": "VirtualLocation",
      "url": hackathon.websiteUrl
    } : {
      "@type": "Place",
      "name": hackathon.location,
      "address": hackathon.location
    },
    "offers": {
      "@type": "Offer",
      "url": hackathon.websiteUrl,
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": hackathon.registrationDeadline
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Banner */}
      <div className="w-full h-48 md:h-64 lg:h-80 bg-gradient-to-r from-violet-600 to-fuchsia-600 relative">
        {hackathon.bannerUrl && (
          <img src={hackathon.bannerUrl} alt={hackathon.title} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="container max-w-6xl -mt-16 relative z-10">
        <div className="bg-background rounded-xl shadow-sm border p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="uppercase tracking-wider font-semibold text-xs">
                {hackathon.status}
              </Badge>
              {hackathon.difficulty !== 'all' && (
                <Badge variant="outline" className="uppercase tracking-wider font-semibold text-xs">
                  {hackathon.difficulty} Level
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{hackathon.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm md:text-base">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {format(hackathon.startDate, 'MMM d')} - {format(hackathon.endDate, 'MMM d, yyyy')}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {hackathon.isOnline ? "Online" : hackathon.location}</span>
              <span className="flex items-center"><Trophy className="w-4 h-4 mr-2 text-amber-500" /> {hackathon.prizePool ? `$${hackathon.prizePool.toLocaleString()}` : 'Swag'}</span>
            </div>
          </div>
          
          <div className="w-full md:w-auto bg-muted/30 p-4 rounded-lg border flex flex-col space-y-4 min-w-[250px]">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Registration Closes</p>
              <div className="text-xl font-bold">
                <CountdownTimer deadline={hackathon.registrationDeadline} />
              </div>
            </div>
            <a href={hackathon.registrationUrl} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full bg-violet-600 hover:bg-violet-700" size="lg">
                Register Now <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <BookmarkButton 
              hackathonId={hackathon.id} 
              initialIsBookmarked={isBookmarked} 
              authenticated={!!session} 
            />
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none px-2 py-3 text-base">
              Overview
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none px-2 py-3 text-base">
              Teams <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0 text-xs">{hackathon.teams.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-2xl font-bold mb-4">About this hackathon</h3>
                  <div className="prose prose-violet max-w-none text-muted-foreground">
                    <MarkdownViewer content={hackathon.description} />
                  </div>
                </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Location</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="w-5 h-5" />
                      <span>{hackathon.location}</span>
                    </div>
                    {!hackathon.isOnline && (
                      <HackathonMap location={hackathon.location} title={hackathon.title} />
                    )}
                  </section>

                <section>
                  <h3 className="text-2xl font-bold mb-4">Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.themes.map(t => (
                      <Badge key={t} variant="secondary" className="text-sm px-3 py-1 bg-violet-100 text-violet-800 hover:bg-violet-200">{t}</Badge>
                    ))}
                  </div>
                </section>
                
                <section>
                  <h3 className="text-2xl font-bold mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.technologies.map(t => (
                      <Badge key={t} variant="outline" className="text-sm px-3 py-1">{t}</Badge>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <div className="bg-background rounded-xl shadow-sm border p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-violet-600" /> Team Requirements</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Min Size</span>
                      <span className="font-semibold">{hackathon.minTeamSize} Member{hackathon.minTeamSize > 1 ? 's' : ''}</span>
                    </li>
                    <li className="flex justify-between pb-2">
                      <span className="text-muted-foreground">Max Size</span>
                      <span className="font-semibold">{hackathon.maxTeamSize} Members</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-background rounded-xl shadow-sm border p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center"><Globe className="w-5 h-5 mr-2 text-violet-600" /> Links</h4>
                  <a href={hackathon.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-600 hover:underline flex items-center">
                    Official Website <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Find a Team</h3>
              {currentUserId && <TeamCreateButton hackathonId={hackathon.id} />}
            </div>

            {hackathon.teams.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-background border-dashed">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">No teams looking for members yet</h4>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">Be the first to create a team and start recruiting members with the skills you need.</p>
                {currentUserId
                  ? <TeamCreateButton hackathonId={hackathon.id} label="Create the First Team" />
                  : <a href="/login"><Button variant="outline">Sign in to Create a Team</Button></a>
                }
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathon.teams.map(team => {
                  const isAlreadyMember = team.members.some(m => m.user && (m.user as { id?: string }).id === currentUserId);
                  return (
                    <TeamCard
                      key={team.id}
                      team={team}
                      currentUserId={currentUserId}
                      isAlreadyMember={isAlreadyMember}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
