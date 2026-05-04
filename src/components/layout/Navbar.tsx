import Link from 'next/link';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NavbarClient } from './NavbarClient';


export async function Navbar() {
  const session = await auth();
  let user = null;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: dbUser?.role || "user"
    };
  }


  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-white/10">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
               <span className="text-white font-black text-xl">H</span>
            </div>
            <span className="font-black text-2xl tracking-tighter group-hover:text-primary transition-colors">HackFinder</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/hackathons" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all">
              Hackathons
            </Link>
            <Link href="/teams" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all">
              Teams
            </Link>
            <Link href="/dashboard/bookmarks" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all">
              Bookmarks
            </Link>
          </nav>
        </div>

        <NavbarClient user={user} />
      </div>
    </header>
  );
}
