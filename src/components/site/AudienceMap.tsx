import { useEffect, useState } from "react";

type Pin = {
  id: string;
  name: string;
  city: string;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function AudienceMap({ pins }: { pins: Pin[] }) {
  const [mounted, setMounted] = useState(false);
  const [Comp, setComp] = useState<null | {
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    CircleMarker: typeof import("react-leaflet").CircleMarker;
    Tooltip: typeof import("react-leaflet").Tooltip;
  }>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const rl = await import("react-leaflet");
      await import("leaflet/dist/leaflet.css");
      if (!alive) return;
      setComp({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        CircleMarker: rl.CircleMarker,
        Tooltip: rl.Tooltip,
      });
      setMounted(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const valid = pins.filter(
    (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
  );

  if (!mounted || !Comp) {
    return (
      <div
        className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-border bg-muted/40 text-sm text-muted-foreground"
        aria-label="Map loading"
      >
        Loading map…
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip } = Comp;

  return (
    <div className="overflow-hidden rounded-2xl border border-border" style={{ boxShadow: "var(--shadow-soft)" }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height: 420, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {valid.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.latitude as number, p.longitude as number]}
            radius={7}
            pathOptions={{
              color: "#e25822",
              fillColor: "#e25822",
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Tooltip>
              <div className="text-xs">
                <div className="font-semibold">{p.name}</div>
                <div className="text-muted-foreground">
                  {p.city}
                  {p.country ? `, ${p.country}` : ""}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
