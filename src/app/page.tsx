"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Trophy, Users, Calendar, Rocket, Sparkles, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [stats, setStats] = useState({ hackathons: 0, prizes: "$0", hackers: 0 });

  useEffect(() => {
    // In a real app, these would come from the server. 
    // For the "WOW" effect, we'll animate them in.
    setStats({
      hackathons: 1250,
      prizes: "$2.4M",
      hackers: 45000
    });
  }, []);

  return (
    <div className="relative flex flex-col items-center overflow-hidden min-h-screen">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-900 dark:opacity-20" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-yellow-900 dark:opacity-20" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-900 dark:opacity-20" />

      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover the future of hackathons</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
          >
            Your next big idea <br />
            <span className="text-gradient">starts here.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            The ultimate platform for developers to find hackathons, track deadlines, and collaborate with teams worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/hackathons">
              <Button size="lg" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-lg font-semibold shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95">
                Explore Events <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white/10">
                Join Community
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Glass Cards */}
      <section className="relative w-full py-20">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card p-10 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-4xl font-black mb-2">{stats.hackathons}+</h3>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Events Tracked</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card p-10 flex flex-col items-center text-center group border-primary/20 bg-primary/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-4xl font-black mb-2 text-gradient">{stats.prizes}</h3>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Total Prize Pool</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card p-10 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-4xl font-black mb-2">{stats.hackers.toLocaleString()}+</h3>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Active Hackers</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative w-full py-32 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Built for the <span className="text-gradient">modern developer.</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to go from idea to deployment in one place.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Rocket, title: "Quick Apply", desc: "One-click registration for your favorite hackathons." },
              { icon: Users, title: "Team Finder", desc: "AI-powered matching to find your perfect co-founders." },
              { icon: Globe, title: "Global Events", desc: "Access hackathons from around the world, online and IRL." },
              { icon: Trophy, title: "Skill Tracking", desc: "Build your portfolio as you compete and win prizes." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-background border hover:border-primary/50 transition-colors"
              >
                <feature.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

