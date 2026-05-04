import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Trophy, 
  LayoutGrid, 
  Bell, 
  ArrowUpRight,
  Plus,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getAdminStats() {
  const [userCount, hackathonCount, teamCount, notificationCount] = await Promise.all([
    prisma.user.count(),
    prisma.hackathon.count(),
    prisma.team.count(),
    prisma.notification.count(),
  ]);

  return { userCount, hackathonCount, teamCount, notificationCount };
}

export default async function AdminDashboard() {
  const session = await auth();
  
  // Admin Check
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true }
  });

  if (user?.role !== "admin") {
    redirect("/");
  }

  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats.userCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Hackathons",
      value: stats.hackathonCount,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: "Total Teams",
      value: stats.teamCount,
      icon: LayoutGrid,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      title: "Notifications Sent",
      value: stats.notificationCount,
      icon: Bell,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/30",
    },
  ];

  return (
    <div className="container py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Monitor and manage the HackFinder platform.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> Platform Settings
            </Link>
          </Button>
          <Button asChild className="bg-violet-600 hover:bg-violet-700">
            <Link href="/admin/hackathons/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Hackathon
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-background/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Hackathons</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/hackathons" className="text-violet-600">
                  View all <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {/* Fetch and map recent hackathons here */}
               <p className="text-sm text-muted-foreground text-center py-8">
                 Manage hackathons from the hackathon management page.
               </p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Database Status</span>
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Scraper Service</span>
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> Idle
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email Service (Resend)</span>
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> Operational
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
