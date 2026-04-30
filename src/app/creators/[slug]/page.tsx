import type { Metadata } from "next";
import { CreatorProfile } from "./creator-profile";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const displayName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${displayName}`,
    description: `Get on ${displayName}'s fan map and meet them in real life.`,
    openGraph: {
      title: `${displayName} — MeetYourFans`,
      description: `See where ${displayName}'s fans are around the world.`,
    },
  };
}

export default async function CreatorSlugPage({ params }: Props) {
  const { slug } = await params;
  return <CreatorProfile slug={slug} />;
}
