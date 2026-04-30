"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

type Pin = {
  id: string;
  name: string;
  city: string;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

export default function AudienceMapInner({ pins }: { pins: Pin[] }) {
  const valid = pins.filter(
    (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
  );

  return (
    <div
      className="overflow-hidden rounded-2xl border border-border"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
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
