import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminHackathonsPage() {
  const session = await auth();
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true }
  });

  if (user?.role !== "admin") {
    redirect("/");
  }

  const hackathons = await prisma.hackathon.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-violet-600 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Manage Hackathons</h1>
          <p className="text-muted-foreground">
            Create, update, or remove hackathons from the platform.
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700">
          <Link href="/admin/hackathons/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Hackathon
          </Link>
        </Button>
      </div>

      <div className="bg-background border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[300px]">Hackathon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hackathons.length > 0 ? (
              hackathons.map((h) => (
                <TableRow key={h.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{h.title}</span>
                      <span className="text-xs text-muted-foreground font-normal line-clamp-1">{h.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={h.status === "upcoming" ? "outline" : "secondary"} className="capitalize">
                      {h.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(h.registrationDeadline), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{h.isOnline ? "Online" : h.location}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild title="View Public Page">
                        <Link href={`/hackathons/${h.slug}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Edit">
                        <Link href={`/admin/hackathons/${h.id}/edit`}>
                          <Edit className="w-4 h-4 text-violet-600" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No hackathons found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
