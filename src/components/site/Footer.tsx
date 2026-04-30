import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetYourFans
        </p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Built with
          <Heart className="h-4 w-4 text-primary" fill="currentColor" />
          by{" "}
          <span className="font-semibold text-foreground">The Boring Media</span>
        </p>
      </div>
    </footer>
  );
}
