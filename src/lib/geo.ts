export type GeoInfo = {
  city: string;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

// Best-effort, IP-based geolocation. No API key required.
export async function detectCity(): Promise<GeoInfo> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("geo failed");
    const j = await res.json();
    return {
      city: j.city ?? "",
      country: j.country_name ?? null,
      latitude: typeof j.latitude === "number" ? j.latitude : null,
      longitude: typeof j.longitude === "number" ? j.longitude : null,
    };
  } catch {
    return { city: "", country: null, latitude: null, longitude: null };
  }
}

// Fallback geocode via Open-Meteo (no key) when user types a city manually.
export async function geocodeCity(city: string): Promise<{ latitude: number; longitude: number; country: string | null } | null> {
  if (!city.trim()) return null;
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    );
    if (!res.ok) return null;
    const j = await res.json();
    const r = j?.results?.[0];
    if (!r) return null;
    return { latitude: r.latitude, longitude: r.longitude, country: r.country ?? null };
  } catch {
    return null;
  }
}
