"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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

export function CreatorProfile({ slug }: { slug: string }) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatorNotFound, setCreatorNotFound] = useState(false);

  useEffect(() => {
    supabase
      .rpc("get_creator_by_slug", { _slug: slug })
      .then(({ data, error }) => {
        if (error || !data || (data as Creator[]).length === 0) {
          setCreatorNotFound(true);
          setLoading(false);
          return;
        }
        const c = (data as Creator[])[0];
        setCreator(c);

        supabase
          .rpc("get_audience_pins", { _creator_id: c.id })
          .then(({ data: pinData }) => {
            setPins((pinData ?? []) as Pin[]);
            setLoading(false);
          });
      });
  }, [slug]);

  if (creatorNotFound) {
    notFound();
  }

  if (!creator || loading) {
    return (
      <SiteShell>
        <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
          Loading…
        </div>
      </SiteShell>
    );
  }

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
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              {creator.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {creator.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-medium text-foreground">
                    {socialLabel(creator.social_type)}
                  </span>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      @{creator.social_handle}{" "}
                      <ExternalLink className="h-3.5 w-3.5" />
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
              href={`/creators/${slug}/join`}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              I&apos;m a fan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Fan map - Located {pins.length} {pins.length === 1 ? "fan" : "fans"} around the world
        </div>
        <AudienceMap pins={pins} />

        {pins.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No fans on the map yet.</p>
            <Link
              href={`/creators/${slug}/join`}
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Be the first →
            </Link>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
