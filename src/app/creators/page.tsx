import type { Metadata } from "next";
import { CreatorsList } from "./creators-list";

export const metadata: Metadata = {
  title: "Creators",
  description:
    "Browse creators using MeetYourFans to organise real-life meetups with their audience.",
  openGraph: {
    title: "Creators on MeetYourFans",
    description: "Find your favourite creators and get on their fan map.",
  },
};

export default function CreatorsPage() {
  return <CreatorsList />;
}
