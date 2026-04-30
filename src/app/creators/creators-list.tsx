"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { socialLabel } from "@/lib/social";
import { ArrowRight, Users, ExternalLink } from "lucide-react";

type Creator = {
  id: string;
  name: string;
  social_type: string;
  social_handle: string;
  slug: string;
  audience_count: number;
};

export function CreatorsList() {
  const [creators, setCreators] = useState<Creator[] | null>(null);

  useEffect(() => {
    supabase
      .rpc("get_creators_public")
      .then(({ data }) => setCreators((data ?? []) as Creator[]));
  }, []);

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Creators
            </h1>
            <p className="mt-2 text-muted-foreground">
              Pick a creator and get on their fan map.
            </p>
          </div>
          <Link
            href="/creators/register"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            Become a creator <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          {creators === null ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl border border-border bg-muted/40"
                />
              ))}
            </div>
          ) : creators.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-muted-foreground">No creators yet. Be the first!</p>
              <Link
                href="/creators/register"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Register as a creator <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creators.map((c) => (
                <Link
                  key={c.id}
                  href={`/creators/${c.slug}`}
                  className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1"
                  style={{ boxShadow: "0 1px 2px oklch(0 0 0 / 0.04)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-primary-foreground"
                      style={{ background: "var(--gradient-hero)" }}
                    >
                      {c.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">{c.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {socialLabel(c.social_type)} · @{c.social_handle}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {c.audience_count} {c.audience_count === 1 ? "fan" : "fans"}
                    </span>
                    <span className="font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      View <ExternalLink className="ml-0.5 inline h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
