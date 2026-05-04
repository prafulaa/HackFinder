import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "HackFinder | Discover and Join Hackathons",
    template: "%s | HackFinder"
  },
  description: "Find your next hackathon, build your dream team, and win prizes. The ultimate platform for hackers worldwide.",
  keywords: ["hackathon", "developer", "coding", "competition", "teams", "projects", "tech"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hackfinder.vercel.app",
    siteName: "HackFinder",
    title: "HackFinder | Discover and Join Hackathons",
    description: "Your next big idea starts here. Discover hackathons, find teammates, and build something amazing.",
    images: [
      {
        url: "https://hackfinder.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "HackFinder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HackFinder | Discover and Join Hackathons",
    description: "Discover hackathons, find teammates, and build something amazing.",
    images: ["https://hackfinder.vercel.app/og-image.png"],
  },
};


import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SessionProvider } from "@/components/layout/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

