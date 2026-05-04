const fs = require('fs');

// src/app/login/page.tsx
let f = 'src/app/login/page.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('import { Github, Mail } from "lucide-react";', 'import { Mail } from "lucide-react";');
c = c.replace('<Github className="mr-2 h-4 w-4" />', '<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>');
fs.writeFileSync(f, c);

// src/app/api/bookmarks/route.ts
f = 'src/app/api/bookmarks/route.ts';
c = fs.readFileSync(f, 'utf8');
c = c.replace('catch (error: any) {', 'catch (error: unknown) {');
c = c.replace('if (error.code === \\'P2002\\') {', 'if (typeof error === \\'object\\' && error !== null && \\'code\\' in error && (error as {code: string}).code === \\'P2002\\') {');
fs.writeFileSync(f, c);

// src/app/dashboard/page.tsx
f = 'src/app/dashboard/page.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace('import { HackathonGrid } from "@/components/hackathon/HackathonGrid";\\n', '');
c = c.replace('import { AlertCircle, Calendar, Target, Trophy } from "lucide-react";', 'import { AlertCircle, Target, Trophy } from "lucide-react";');
c = c.replace('const bookmarkIds = bookmarks.map(b => b.hackathonId);\\n\\n', '');
c = c.replace(/You\\'re/g, 'You&apos;re');
c = c.replace(/you\\'re/g, 'you&apos;re');
fs.writeFileSync(f, c);

// src/app/hackathons/page.tsx
f = 'src/app/hackathons/page.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace('import Link from "next/link";\\n', '');
c = c.replace('async function getHackathons(searchParams: any) {', 'async function getHackathons(searchParams: Record<string, string | string[] | undefined>) {');
c = c.replace('const where: any = {};', 'const where: Record<string, unknown> = {};');
c = c.replace('let orderBy: any = { registrationDeadline: \\'asc\\' };', 'let orderBy: Record<string, \\'asc\\' | \\'desc\\'> = { registrationDeadline: \\'asc\\' };');
fs.writeFileSync(f, c);

// src/components/hackathon/CountdownTimer.tsx
f = 'src/components/hackathon/CountdownTimer.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace('const [expired, setExpired] = useState(false);\\n  ', '');
c = c.replace('setExpired(true);\\n      ', '');
fs.writeFileSync(f, c);

// src/components/hackathon/HackathonCard.tsx
f = 'src/components/hackathon/HackathonCard.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace('import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";', 'import { Card, CardContent, CardHeader } from "@/components/ui/card";');
c = c.replace('catch (error) {', 'catch (_error) {');
fs.writeFileSync(f, c);

// src/components/hackathon/HackathonGrid.tsx
f = 'src/components/hackathon/HackathonGrid.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace('hackathons: any[];', 'hackathons: { id: string; title: string; slug: string; bannerUrl: string | null; registrationDeadline: Date; prizePool: number | null; location: string; isOnline: boolean; themes: string[]; difficulty: string; status: string; }[];');
c = c.replace(/couldn\\'t/g, 'couldn&apos;t');
fs.writeFileSync(f, c);

// src/components/layout/Navbar.tsx
f = 'src/components/layout/Navbar.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace('import { Search, Bell, MapPin } from "lucide-react";', 'import { Search } from "lucide-react";');
c = c.replace('import { UserAvatar } from "./UserAvatar"; // We will create this\\n\\n', '');
fs.writeFileSync(f, c);
