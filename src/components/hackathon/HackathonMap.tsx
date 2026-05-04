"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface HackathonMapProps {
  location: string;
  title: string;
}

export default function HackathonMap({ location, title }: HackathonMapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic Geocoding using Nominatim (free)
    async function geocode() {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (location && location !== "Online") {
      geocode();
    } else {
      setLoading(false);
    }
  }, [location]);

  if (loading) return <div className="h-64 w-full bg-muted animate-pulse rounded-xl" />;
  if (!coords) return null;

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border shadow-sm z-0">
      <MapContainer 
        center={coords} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>
            <div className="font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground">{location}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
