import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Join as a Fan",
  description:
    "Sign up to get on the map and let your favourite creators know you're here.",
  openGraph: {
    title: "Join as a Fan — MeetYourFans",
    description: "Get on the map. Meet your favourite creators in real life.",
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
