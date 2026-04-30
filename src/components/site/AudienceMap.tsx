"use client";

import dynamic from "next/dynamic";

type Pin = {
  id: string;
  name: string;
  city: string;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

const AudienceMapInner = dynamic(() => import("./AudienceMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-border bg-muted/40 text-sm text-muted-foreground"
      aria-label="Map loading"
    >
      Loading map…
    </div>
  ),
});

export function AudienceMap({ pins }: { pins: Pin[] }) {
  return <AudienceMapInner pins={pins} />;
}
