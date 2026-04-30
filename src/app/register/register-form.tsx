"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { SiteShell } from "@/components/site/SiteShell";
import { Field } from "@/components/site/FormField";
import { supabase } from "@/integrations/supabase/client";
import { detectCity, geocodeCity } from "@/lib/geo";
import { MapPin, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  contact_number: z.string().trim().max(30).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(80),
});

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", contact_number: "", city: "" });
  const [coords, setCoords] = useState<{
    lat: number | null;
    lng: number | null;
    country: string | null;
  }>({ lat: null, lng: null, country: null });
  const [detecting, setDetecting] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    detectCity().then((g) => {
      setForm((f) => ({ ...f, city: f.city || g.city }));
      setCoords({ lat: g.latitude, lng: g.longitude, country: g.country });
      setDetecting(false);
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);

    let { lat, lng, country } = coords;
    if (lat == null || lng == null) {
      const g = await geocodeCity(form.city);
      if (g) {
        lat = g.latitude;
        lng = g.longitude;
        country = country ?? g.country;
      }
    }

    const { error } = await supabase.from("audience_members").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      contact_number: parsed.data.contact_number || null,
      city: parsed.data.city,
      country,
      latitude: lat,
      longitude: lng,
    });

    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("You're on the map! 🎉");
    setTimeout(() => router.push("/creators"), 800);
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Join as a fan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Get on the map. We&apos;ll show creators where you are.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Your name"
              maxLength={80}
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              placeholder="you@example.com"
              maxLength={255}
            />
          </Field>
          <Field label="Contact number" hint="Optional">
            <input
              value={form.contact_number}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
              className="input"
              placeholder="+1 555 0100"
              maxLength={30}
            />
          </Field>
          <Field
            label="City"
            hint={
              detecting
                ? "Detecting…"
                : coords.country
                  ? `Auto-detected · ${coords.country}`
                  : "Auto-detected"
            }
          >
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input pl-9"
                placeholder={detecting ? "Detecting…" : "Your city"}
                maxLength={80}
              />
            </div>
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Get me on the map
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Your email and number stay private. Only your name &amp; city show on creator
            maps.
          </p>
        </form>
      </section>
    </SiteShell>
  );
}
