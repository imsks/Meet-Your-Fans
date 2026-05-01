import type { Metadata } from "next";
import { JoinCreatorForm } from "./join-form";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const displayName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `Join ${displayName}'s Fan Map`,
    description: `Sign up to get on ${displayName}'s fan map and meet them in real life.`,
    openGraph: {
      title: `Join ${displayName}'s Fan Map — MeetYourFans`,
      description: `Get on ${displayName}'s map. Let them know you're here.`,
    },
  };
}

export default async function JoinCreatorPage({ params }: Props) {
  const { slug } = await params;
  return <JoinCreatorForm slug={slug} />;
}
