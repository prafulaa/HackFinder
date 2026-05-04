import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComingSoonPage({ params }: { params: { slug: string[] } }) {
  const pageName = params.slug
    .join(" ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-2xl mb-6">
        🚧
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-3">{pageName}</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        This page is coming soon. We&apos;re working on it!
      </p>
      <Link href="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
}
