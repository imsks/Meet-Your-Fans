import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="text-base sm:text-lg">MeetYourFans</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/creators"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 text-sm font-medium text-foreground" }}
          >
            Creators
          </Link>
          <Link
            to="/register"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 text-sm font-medium text-foreground" }}
          >
            Join as Fan
          </Link>
          <Link
            to="/creators/register"
            className="ml-1 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
          >
            Become a Creator
          </Link>
        </nav>
      </div>
    </header>
  );
}
