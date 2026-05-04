"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, LayoutDashboard, User, LogOut, Menu, Trophy, Info, Users as UsersIcon, Shield, Heart } from "lucide-react";

import { signOutAction } from "@/app/actions/auth";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface NavbarClientProps {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}


export function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("search") as HTMLInputElement)?.value;
    if (q) router.push(`/hackathons?search=${encodeURIComponent(q)}`);
    else router.push("/hackathons");
  }

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="hidden md:flex relative">
        <form onSubmit={handleSearch}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Search..."
            className="w-[200px] lg:w-[320px] pl-10 h-11 bg-white/5 dark:bg-white/[0.03] border-white/10 dark:border-white/[0.05] rounded-xl focus-visible:ring-primary focus-visible:bg-white/10 transition-all placeholder:text-muted-foreground/50"
          />
        </form>
      </div>

      <ThemeToggle />
      
      {user && <NotificationBell />}

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ml-2 transition-transform hover:scale-105 active:scale-95 shadow-lg">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-white font-black">
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 border-b mb-1">
              <p className="text-sm font-medium truncate">{user.name ?? "Hacker"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center w-full">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/profile/${user.id}`} className="flex items-center w-full">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/bookmarks" className="flex items-center w-full">
                <Heart className="mr-2 h-4 w-4" />
                Bookmarks
              </Link>
            </DropdownMenuItem>
            {user.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center w-full text-violet-600 font-medium">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOutAction} className="w-full">
                <button type="submit" className="flex items-center w-full text-sm text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-bold hover:bg-white/10 rounded-xl px-5">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl px-6 font-bold" size="sm">Get Started</Button>
          </Link>
        </div>
      )}

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="text-left text-violet-600 font-bold">HackFinder</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 py-8">
              <div className="relative">
                <form onSubmit={(e) => { handleSearch(e); setIsSheetOpen(false); }}>
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    name="search"
                    placeholder="Search..."
                    className="w-full pl-8 bg-muted/50"
                  />
                </form>
              </div>
              <nav className="flex flex-col gap-4">
                <Link href="/hackathons" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 text-lg font-medium hover:text-violet-600 transition-colors">
                  <Trophy className="h-5 w-5" /> Browse Hackathons
                </Link>
                <Link href="/teams" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 text-lg font-medium hover:text-violet-600 transition-colors">
                  <UsersIcon className="h-5 w-5" /> Teams
                </Link>
                <Link href="/about" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 text-lg font-medium hover:text-violet-600 transition-colors">
                  <Info className="h-5 w-5" /> About
                </Link>
                {user && (
                  <Link href="/dashboard/bookmarks" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 text-lg font-medium hover:text-violet-600 transition-colors">
                    <Heart className="h-5 w-5" /> Bookmarks
                  </Link>
                )}
              </nav>
              <div className="mt-auto pt-8 border-t">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                        <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start" asChild onClick={() => setIsSheetOpen(false)}>
                      <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild onClick={() => setIsSheetOpen(false)}>
                      <Link href={`/profile/${user.id}`}><User className="mr-2 h-4 w-4" /> Profile</Link>
                    </Button>
                    <form action={signOutAction}>
                      <Button variant="destructive" className="w-full justify-start" type="submit">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                      <Button className="w-full bg-violet-600 hover:bg-violet-700">Sign Up Free</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

