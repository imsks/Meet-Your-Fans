import type { Metadata } from "next";
import { CreatorRegisterForm } from "./creator-register-form";

export const metadata: Metadata = {
  title: "Become a Creator",
  description:
    "Register as a creator and start mapping your audience for real-life meetups.",
  openGraph: {
    title: "Become a Creator — MeetYourFans",
    description:
      "Build community beyond the platform. Map your fans. Meet them IRL.",
  },
};

export default function CreatorRegisterPage() {
  return <CreatorRegisterForm />;
}
