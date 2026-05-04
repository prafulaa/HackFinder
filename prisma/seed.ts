import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.bookmark.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.hackathonTag.deleteMany()
  await prisma.hackathon.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding Demo Users...')
  const admin = await prisma.user.create({
    data: {
      email: 'demo@hackfinder.dev',
      name: 'Admin User',
      skills: ['React', 'Next.js', 'Prisma', 'TypeScript'],
      experienceLevel: 'advanced',
    },
  })

  const alice = await prisma.user.create({
    data: {
      email: 'alice@hackfinder.dev',
      name: 'Alice',
      skills: ['React', 'Python'],
      experienceLevel: 'intermediate',
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@hackfinder.dev',
      name: 'Bob',
      skills: ['JavaScript', 'HTML'],
      experienceLevel: 'beginner',
    },
  })

  console.log('Seeding Hackathons...')
  const hackathons = [
    {
      title: 'HackMIT 2025',
      slug: 'hackmit-2025',
      description: 'MIT\'s premier hackathon.',
      websiteUrl: 'https://hackmit.org',
      registrationUrl: 'https://hackmit.org',
      startDate: new Date('2025-10-01T09:00:00Z'),
      endDate: new Date('2025-10-03T17:00:00Z'),
      registrationDeadline: new Date('2025-09-15T23:59:59Z'),
      location: 'Boston',
      isOnline: false,
      prizePool: 50000,
      themes: ['AI', 'Web'],
      technologies: ['React', 'Python'],
      difficulty: 'all',
      organizerId: admin.id,
    },
    {
      title: 'CalHacks 11.0',
      slug: 'calhacks-11-0',
      description: 'The world\'s largest collegiate hackathon.',
      websiteUrl: 'https://calhacks.io',
      registrationUrl: 'https://calhacks.io',
      startDate: new Date('2025-11-05T09:00:00Z'),
      endDate: new Date('2025-11-07T17:00:00Z'),
      registrationDeadline: new Date('2025-10-20T23:59:59Z'),
      location: 'UC Berkeley',
      isOnline: false,
      prizePool: 40000,
      themes: ['All'],
      difficulty: 'all',
      organizerId: admin.id,
    },
    {
      title: 'TreeHacks',
      slug: 'treehacks-2026',
      description: 'Stanford\'s premier hackathon.',
      websiteUrl: 'https://treehacks.com',
      registrationUrl: 'https://treehacks.com',
      startDate: new Date('2026-02-15T09:00:00Z'),
      endDate: new Date('2026-02-17T17:00:00Z'),
      registrationDeadline: new Date('2026-01-30T23:59:59Z'),
      location: 'Stanford',
      isOnline: false,
      prizePool: 30000,
      themes: ['ClimaTech', 'AI'],
      difficulty: 'intermediate',
      organizerId: admin.id,
    },
    {
      title: 'PennApps XXVI',
      slug: 'pennapps-xxvi',
      description: 'The nation\'s first college hackathon.',
      websiteUrl: 'https://pennapps.com',
      registrationUrl: 'https://pennapps.com',
      startDate: new Date('2025-09-08T09:00:00Z'),
      endDate: new Date('2025-09-10T17:00:00Z'),
      registrationDeadline: new Date('2025-08-25T23:59:59Z'),
      location: 'UPenn',
      isOnline: false,
      prizePool: 25000,
      themes: ['HealthTech'],
      difficulty: 'all',
      organizerId: admin.id,
    },
    {
      title: 'HackHarvard',
      slug: 'hackharvard-2025',
      description: 'Explore, build, create.',
      websiteUrl: 'https://hackharvard.io',
      registrationUrl: 'https://hackharvard.io',
      startDate: new Date('2025-10-20T09:00:00Z'),
      endDate: new Date('2025-10-22T17:00:00Z'),
      registrationDeadline: new Date('2025-10-05T23:59:59Z'),
      location: 'Harvard',
      isOnline: false,
      prizePool: 20000,
      themes: ['Social Impact'],
      difficulty: 'all',
      organizerId: admin.id,
    },
    {
      title: 'MakeUC 2025',
      slug: 'makeuc-2025',
      description: 'Create something amazing at MakeUC.',
      websiteUrl: 'https://makeuc.io',
      registrationUrl: 'https://makeuc.io',
      startDate: new Date('2025-11-12T09:00:00Z'),
      endDate: new Date('2025-11-14T17:00:00Z'),
      registrationDeadline: new Date('2025-10-30T23:59:59Z'),
      location: 'U Cincinnati',
      isOnline: false,
      prizePool: 15000,
      themes: ['General'],
      difficulty: 'all',
      organizerId: admin.id,
    },
    {
      title: 'GMU HackMason',
      slug: 'gmu-hackmason',
      description: 'Build your ideas at HackMason.',
      websiteUrl: 'https://hackmason.org',
      registrationUrl: 'https://hackmason.org',
      startDate: new Date('2026-03-20T09:00:00Z'),
      endDate: new Date('2026-03-22T17:00:00Z'),
      registrationDeadline: new Date('2026-03-05T23:59:59Z'),
      location: 'George Mason University',
      isOnline: false,
      prizePool: 10000,
      themes: ['General'],
      difficulty: 'beginner',
      organizerId: admin.id,
    },
    {
      title: 'SheHacks+ 7',
      slug: 'shehacks-7',
      description: 'Empowering women and non-binary hackers.',
      websiteUrl: 'https://shehacks.io',
      registrationUrl: 'https://shehacks.io',
      startDate: new Date('2026-01-10T09:00:00Z'),
      endDate: new Date('2026-01-12T17:00:00Z'),
      registrationDeadline: new Date('2025-12-28T23:59:59Z'),
      location: 'Online',
      isOnline: true,
      prizePool: 8000,
      themes: ['Women in Tech'],
      difficulty: 'all',
      organizerId: admin.id,
    },
    {
      title: 'Hack the North 2025',
      slug: 'hack-the-north-2025',
      description: 'Canada\'s biggest hackathon.',
      websiteUrl: 'https://hackthenorth.com',
      registrationUrl: 'https://hackthenorth.com',
      startDate: new Date('2025-09-15T09:00:00Z'),
      endDate: new Date('2025-09-17T17:00:00Z'),
      registrationDeadline: new Date('2025-08-30T23:59:59Z'),
      location: 'Waterloo',
      isOnline: false,
      prizePool: 45000,
      themes: ['All'],
      difficulty: 'all',
      organizerId: admin.id,
    },
    {
      title: 'WildHacks',
      slug: 'wildhacks',
      description: 'Northwestern\'s premier hackathon.',
      websiteUrl: 'https://wildhacks.org',
      registrationUrl: 'https://wildhacks.org',
      startDate: new Date('2025-10-25T09:00:00Z'),
      endDate: new Date('2025-10-27T17:00:00Z'),
      registrationDeadline: new Date('2025-10-10T23:59:59Z'),
      location: 'Northwestern',
      isOnline: false,
      prizePool: 12000,
      themes: ['General'],
      difficulty: 'all',
      organizerId: admin.id,
    },
    // Adding 10 more mock events to hit the 20 requested
    ...Array.from({ length: 10 }).map((_, i) => ({
      title: `Online Hackathon ${i + 1}`,
      slug: `online-hackathon-${i + 1}`,
      description: `A great online hackathon to test your skills. Edition ${i + 1}.`,
      websiteUrl: 'https://example.com',
      registrationUrl: 'https://example.com',
      startDate: new Date(`2026-0${(i % 5) + 4}-10T09:00:00Z`),
      endDate: new Date(`2026-0${(i % 5) + 4}-12T17:00:00Z`),
      registrationDeadline: new Date(`2026-0${(i % 5) + 4}-01T23:59:59Z`),
      location: 'Online',
      isOnline: true,
      prizePool: 5000 + i * 1000,
      themes: ['Web3', 'AI', 'SaaS'],
      difficulty: 'beginner',
      organizerId: admin.id,
    }))
  ]

  const createdHackathons = await Promise.all(
    hackathons.map((h) => prisma.hackathon.create({ data: h }))
  )

  console.log('Seeding Bookmarks...')
  // Alice bookmarks first 5
  await Promise.all(
    createdHackathons.slice(0, 5).map((h) =>
      prisma.bookmark.create({
        data: {
          userId: alice.id,
          hackathonId: h.id,
        },
      })
    )
  )

  // Bob bookmarks 2
  await Promise.all(
    createdHackathons.slice(5, 7).map((h) =>
      prisma.bookmark.create({
        data: {
          userId: bob.id,
          hackathonId: h.id,
        },
      })
    )
  )

  console.log('Seeding Teams...')
  const team1 = await prisma.team.create({
    data: {
      name: 'AI Wizards',
      hackathonId: createdHackathons[0].id, // HackMIT
      ownerId: alice.id,
      bio: 'Looking to build an AI powered study tool.',
      neededSkills: ['Frontend', 'Design'],
    },
  })

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: alice.id,
      role: 'owner',
    },
  })

  const team2 = await prisma.team.create({
    data: {
      name: 'Web3 Pioneers',
      hackathonId: createdHackathons[1].id, // CalHacks
      ownerId: bob.id,
      bio: 'Decentralized social media platform.',
      neededSkills: ['Solidity', 'Backend'],
    },
  })

  await prisma.teamMember.create({
    data: {
      teamId: team2.id,
      userId: bob.id,
      role: 'owner',
    },
  })

  console.log('Seeding Notifications...')
  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: 'system',
      title: 'Welcome to HackFinder',
      body: 'Your admin account has been set up successfully.',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
