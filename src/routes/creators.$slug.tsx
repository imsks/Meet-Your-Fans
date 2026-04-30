import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { AudienceMap } from "@/components/site/AudienceMap";
import { supabase } from "@/integrations/supabase/client";
import { socialLabel, socialUrl } from "@/lib/social";
import { ExternalLink, Users, MapPin, ArrowRight } from "lucide-react";

type Creator = {
  id: string;
  name: string;
  social_type: string;
  social_handle: string;
  slug: string;
};

type Pin = {
  id: string;
  name: string;
  city: string;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

export const Route = createFileRoute("/creators/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase.rpc("get_creator_by_slug", { _slug: params.slug });
    if (error) throw error;
    const creator = (data ?? [])[0] as Creator | undefined;
    if (!creator) throw notFound();
    return { creator };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.creator.name} — MeetYourFans` : "Creator — MeetYourFans" },
      {
        name: "description",
        content: loaderData
          ? `Get on ${loaderData.creator.name}'s fan map and meet them in real life.`
          : "Creator profile on MeetYourFans.",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.creator.name} — MeetYourFans` : "Creator — MeetYourFans",
      },
      {
        property: "og:description",
        content: loaderData
          ? `See where ${loaderData.creator.name}'s fans are around the world.`
          : "Creator profile.",
      },
    ],
  }),
  component: CreatorPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Creator not found</h1>
        <p className="mt-2 text-muted-foreground">The creator you're looking for doesn't exist.</p>
        <Link to="/creators" className="mt-6 inline-block text-primary hover:underline">
          Browse all creators →
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell>
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
    </SiteShell>
  ),
});

function CreatorPage() {
  const { creator } = Route.useLoaderData();
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .rpc("get_audience_pins", { _creator_id: creator.id })
      .then(({ data }) => {
        setPins((data ?? []) as Pin[]);
        setLoading(false);
      });
  }, [creator.id]);

  const url = socialUrl(creator.social_type, creator.social_handle);

  return (
    <SiteShell>
      <section
        className="border-b border-border"
        style={{ background: "var(--gradient-warm)" }}
      >
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-primary-foreground"
              style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
            >
              {creator.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {creator.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-medium text-foreground">{socialLabel(creator.social_type)}</span>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      @{creator.social_handle} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span>@{creator.social_handle}</span>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {pins.length} {pins.length === 1 ? "fan" : "fans"} on the map
                </span>
              </div>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
            >
              I'm a fan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Fan map — every dot is a real person waiting for a meetup
        </div>
        {loading ? (
          <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-border bg-muted/40 text-sm text-muted-foreground">
            Loading map…
          </div>
        ) : (
          <AudienceMap pins={pins} />
        )}

        {pins.length === 0 && !loading && (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No fans on the map yet.</p>
            <Link to="/register" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Be the first →
            </Link>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
