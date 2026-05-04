import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";
import slugify from "slugify";

const prisma = new PrismaClient();

async function scrapeDevpost() {
  console.log("Starting production-grade Devpost scraper...");
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();

  try {
    console.log("Navigating to Devpost...");
    await page.goto("https://devpost.com/hackathons", { waitUntil: "networkidle" });
    
    // Wait for tiles to load
    await page.waitForSelector(".hackathon-tile, .tile-anchor", { timeout: 15000 });

    const hackathonsData = await page.evaluate(() => {
      const tiles = Array.from(document.querySelectorAll(".hackathon-tile, a.tile-anchor"));
      return tiles.slice(0, 15).map(tile => {
        const titleEl = tile.querySelector("h3, .title");
        const taglineEl = tile.querySelector(".tagline");
        const imgEl = tile.querySelector(".thumbnail img, .image img");
        const prizeEl = tile.querySelector(".prize-amount, .stats strong");
        const locationEl = tile.querySelector(".location");
        const url = tile instanceof HTMLAnchorElement ? tile.href : (tile.querySelector("a")?.href || "");

        return {
          title: titleEl?.textContent?.trim() || "Untitled Hackathon",
          description: taglineEl?.textContent?.trim() || "No description provided.",
          bannerUrl: imgEl?.getAttribute("src") || null,
          websiteUrl: url,
          location: locationEl?.textContent?.trim() || "Online",
          prizePoolRaw: prizeEl?.textContent?.trim() || "0",
        };
      });
    });

    console.log(`Extracted ${hackathonsData.length} entries. Processing...`);

    const hackathons = hackathonsData.filter(h => h.title && h.websiteUrl).map(h => {
      const prizePool = parseInt(h.prizePoolRaw.replace(/[^0-9]/g, "")) || 0;
      return {
        ...h,
        slug: slugify(h.title, { lower: true, strict: true }),
        registrationUrl: h.websiteUrl,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        status: "upcoming" as const,
        difficulty: "intermediate" as const,
        themes: ["AI", "Web", "General"],
        isOnline: h.location.toLowerCase().includes("online") || !h.location,
        prizePool,
      };
    });

    console.log(`Upserting ${hackathons.length} hackathons to database...`);

    for (const h of hackathons) {
      // Remove temporary prizePoolRaw field
      const { prizePoolRaw, ...data } = h as any;
      
      await prisma.hackathon.upsert({
        where: { slug: data.slug },
        update: {
          title: data.title,
          description: data.description,
          bannerUrl: data.bannerUrl,
          websiteUrl: data.websiteUrl,
          location: data.location,
          isOnline: data.isOnline,
          prizePool: data.prizePool,
        },
        create: data,
      });
    }

    console.log("Scraper finished successfully.");
  } catch (error) {
    console.error("Scraper failed:", error);
    console.log("Falling back to seed data...");
    await seedFallbackData();
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

async function seedFallbackData() {
  const fallback = [
    {
      title: "Edge AI Hackathon 2026",
      slug: "edge-ai-hackathon-2026",
      description: "Build the next generation of edge-optimized AI applications.",
      location: "San Francisco, CA",
      websiteUrl: "https://example.com",
      registrationUrl: "https://example.com/register",
      themes: ["AI", "Edge Computing", "IoT"],
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-06-17"),
      registrationDeadline: new Date("2026-06-10"),
      isOnline: false,
      prizePool: 50000,
    },
    {
      title: "Global Sustainability Jam",
      slug: "global-sustainability-jam",
      description: "Solving climate change with innovative software solutions.",
      location: "Online",
      websiteUrl: "https://example.com",
      registrationUrl: "https://example.com/register",
      themes: ["Sustainability", "Web3", "Social Good"],
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-07-10"),
      registrationDeadline: new Date("2026-06-25"),
      isOnline: true,
      prizePool: 25000,
    }
  ];

  for (const h of fallback) {
    await prisma.hackathon.upsert({
      where: { slug: h.slug },
      update: h,
      create: h,
    });
  }
}

scrapeDevpost();
