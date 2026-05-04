import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container flex flex-col md:flex-row py-10 gap-8 justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <span className="inline-block font-bold text-xl text-violet-600">HackFinder</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Your next big idea starts here. Discover hackathons, find teammates, and build something amazing.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Product</h4>
            <Link href="/hackathons" className="text-sm text-muted-foreground hover:text-foreground">Browse</Link>
            <Link href="/teams" className="text-sm text-muted-foreground hover:text-foreground">Teams</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Company</h4>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Legal</h4>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="container border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} HackFinder. All rights reserved.
      </div>
    </footer>
  );
}
