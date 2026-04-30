import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { Users, Sparkles, MapPin, Calendar, ArrowRight, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-warm)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pt-32 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Move beyond screens. Meet in real life.
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Where creators meet
            <br />
            their{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              biggest fans
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            MeetYourFans helps creators organise real-life meetups with the audience that
            actually cares. Map your fans. Show up. Build community.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/creators/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
            >
              I&apos;m a Creator <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              I&apos;m a Fan
            </Link>
          </div>
          <div className="mt-6">
            <Link
              href="/creators"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Browse creators →
            </Link>
          </div>
        </div>
      </section>

      {/* Why join as creator */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why creators join MeetYourFans
          </h2>
          <p className="mt-3 text-muted-foreground">
            The platform you don&apos;t own owns your audience. We don&apos;t.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Build audience beyond the platform",
              body: "Algorithms change. Your community shouldn't. Own the relationship with your real fans.",
            },
            {
              icon: Sparkles,
              title: "Sell your expertise",
              body: "Workshops, cohorts, talks — meet your audience where they want to pay you.",
            },
            {
              icon: MapPin,
              title: "Move beyond screens",
              body: "See where your fans are on a map. Plan meetups in cities that actually have demand.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1"
              style={{ boxShadow: "0 1px 2px oklch(0 0 0 / 0.04)" }}
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Creators register",
                body: "Add your name, email and your social handle. Get a public page.",
              },
              {
                n: "02",
                title: "Fans join the map",
                body: "Your audience signs up with their city — they appear as a pin on your map.",
              },
              {
                n: "03",
                title: "Meet in real life",
                body: "See where demand is highest. Plan meetups. Show up. (Coming soon.)",
              },
            ].map((s) => (
              <li key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <div className="text-sm font-mono text-primary">{s.n}</div>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Coming soon */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div
          className="rounded-3xl border border-border p-8 sm:p-12"
          style={{ background: "var(--gradient-warm)" }}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Calendar className="h-4 w-4" /> Coming soon
          </div>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Create &amp; request meetups
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Creators will be able to publish meetups in any city. Fans will be able to
            request meetups in theirs. Until then — get on the map.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
            >
              Get on the map <Heart className="h-4 w-4" fill="currentColor" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
