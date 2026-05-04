import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import DailyDigestEmail from "@/emails/DailyDigest";

export async function GET(req: Request) {
  // Verify Cron Secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Fetch hackathons added in the last 24 hours
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const newHackathons = await prisma.hackathon.findMany({
      where: {
        createdAt: {
          gte: yesterday,
        },
      },
      select: {
        title: true,
        description: true,
        slug: true,
      }
    });

    if (newHackathons.length === 0) {
      return NextResponse.json({ message: "No new hackathons to send." });
    }

    // 2. Fetch all users (in a real app, check for notification preferences)
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
      },
    });

    // 3. Send emails
    const emailPromises = users.map((user) => {
      if (!user.email) return Promise.resolve();
      
      return resend.emails.send({
        from: 'HackFinder <onboarding@resend.dev>',
        to: user.email,
        subject: `🚀 ${newHackathons.length} New Hackathons Added Today!`,
        react: DailyDigestEmail({
          userName: user.name || 'Hacker',
          hackathons: newHackathons,
        }),
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ 
      success: true, 
      sentTo: users.length, 
      hackathonsCount: newHackathons.length 
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
