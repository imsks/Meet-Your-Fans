"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const SOCIALS = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "other", label: "Other" },
] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  social_type: z.enum(["instagram", "twitter", "linkedin", "youtube", "other"]),
  social_handle: z.string().trim().min(1, "Social handle is required").max(80),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function CreatorRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    social_type: "instagram" as (typeof SOCIALS)[number]["value"],
    social_handle: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);

    const baseSlug = slugify(parsed.data.name) || "creator";
    let slug = baseSlug;
    for (let i = 0; i < 5; i++) {
      const trySlug =
        i === 0
          ? baseSlug
          : `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
      const { error } = await supabase.from("creators").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        social_type: parsed.data.social_type,
        social_handle: parsed.data.social_handle.replace(/^@/, ""),
        slug: trySlug,
      });
      if (!error) {
        slug = trySlug;
        setSubmitting(false);
        toast.success("Welcome aboard! 🎉");
        setTimeout(() => router.push(`/creators/${slug}`), 700);
        return;
      }
      // 23505 = unique violation
      if (error.code !== "23505") {
        setSubmitting(false);
        toast.error(
          error.message.includes("email")
            ? "That email is already registered."
            : "Something went wrong.",
        );
        return;
      }
    }
    setSubmitting(false);
    toast.error("Could not create a unique page. Try a slightly different name.");
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Become a creator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Get a public page. Map your audience. Meet them in real life.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Name</span>
            <input
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              maxLength={80}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
            <input
              required
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              maxLength={255}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr]">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Platform
              </span>
              <select
                className="input"
                value={form.social_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social_type: e.target.value as typeof form.social_type,
                  })
                }
              >
                {SOCIALS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Handle / Username
              </span>
              <input
                required
                className="input"
                value={form.social_handle}
                onChange={(e) =>
                  setForm({ ...form, social_handle: e.target.value })
                }
                placeholder="yourhandle"
                maxLength={80}
              />
            </label>
          </div>

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
            Create my creator page
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Your email stays private. Only your name &amp; handle appear publicly.
          </p>
        </form>
      </section>
    </SiteShell>
  );
}
