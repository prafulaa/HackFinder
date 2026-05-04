import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface DailyDigestEmailProps {
  userName: string;
  hackathons: {
    title: string;
    description: string;
    slug: string;
  }[];
}

export const DailyDigestEmail = ({
  userName,
  hackathons,
}: DailyDigestEmailProps) => (
  <Html>
    <Head />
    <Preview>New Hackathons for you!</Preview>
    <Tailwind>
      <Body className="bg-[#f6f9fc] font-sans">
        <Container className="bg-white mx-auto py-10 px-5 max-w-[600px]">
          <Heading className="text-[#333] text-2xl font-bold text-center">Hi {userName},</Heading>
          <Text className="text-[#333] text-base leading-[26px]">
            Here are the latest hackathons added to HackFinder in the last 24 hours:
          </Text>
          <Section>
            {hackathons.map((h) => (
              <div key={h.slug} className="py-5">
                <Heading as="h3" className="text-[#4F46E5] text-lg font-bold mb-2">{h.title}</Heading>
                <Text className="text-[#666] text-sm leading-[22px] mb-4">{h.description}</Text>
                <Link 
                  href={`https://hackfinder.vercel.app/hackathons/${h.slug}`} 
                  className="bg-[#4F46E5] rounded-[5px] text-white text-sm font-bold no-underline text-center inline-block px-5 py-[10px]"
                >
                  View Details
                </Link>
                <Hr className="border-[#e6ebf1] my-5" />
              </div>
            ))}
          </Section>
          <Text className="text-[#8898aa] text-xs leading-4">
            You are receiving this because you signed up for daily digests on HackFinder.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default DailyDigestEmail;
