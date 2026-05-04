import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { HackathonGrid } from "@/components/hackathon/HackathonGrid";
import { HackathonFilters } from "@/components/hackathon/HackathonFilters";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getHackathons(searchParams: Record<string, string | string[] | undefined>) {
  const where: Record<string, unknown> = {};

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.isOnline) where.isOnline = searchParams.isOnline === "true";

  if (searchParams.themes) {
    const themesArray = Array.isArray(searchParams.themes) ? searchParams.themes : [searchParams.themes];
    where.themes = { hasSome: themesArray };
  }

  if (searchParams.difficulty) {
    const diffArray = Array.isArray(searchParams.difficulty) ? searchParams.difficulty : [searchParams.difficulty];
    where.difficulty = { in: diffArray };
  }

  let orderBy: Record<string, 'asc' | 'desc'> = { registrationDeadline: 'asc' };
  if (searchParams.sort === "newest") orderBy = { createdAt: 'desc' };
  if (searchParams.sort === "prize") orderBy = { prizePool: 'desc' };

  const page = parseInt((searchParams.page as string) || '1', 10);
  const take = 12;
  const skip = (page - 1) * take;

  const [hackathons, total] = await Promise.all([
    prisma.hackathon.findMany({ where, orderBy, take, skip }),
    prisma.hackathon.count({ where }),
  ]);

  return { hackathons, total, page, take };
}

export default async function HackathonsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [{ hackathons, total, page, take }, session] = await Promise.all([
    getHackathons(searchParams),
    auth(),
  ]);

  const userBookmarks: string[] = session?.user?.id
    ? (await prisma.bookmark.findMany({
        where: { userId: session.user.id },
        select: { hackathonId: true },
      })).map(b => b.hackathonId)
    : [];

  const hasMore = page * take < total;
  const nextPageParams = new URLSearchParams(
    Object.entries(searchParams).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map(val => [k, val]) : v ? [[k, v]] : []
    )
  );
  nextPageParams.set('page', String(page + 1));

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Hackathons</h1>
          <p className="text-muted-foreground mt-1">Find your next project, team, and prize.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
          <HackathonFilters />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading hackathons...</div>}>
            <HackathonGrid hackathons={hackathons} userBookmarks={userBookmarks} />
          </Suspense>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Link href={`/hackathons?${nextPageParams.toString()}`}>
                <Button variant="outline">Load More</Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
