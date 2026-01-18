"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import "@/components/leaflet-fix.css"; // We will create this

// IMPORTANT: Leaflet requires specific CSS to render tiles correctly.
// We also need to ensure the container has a defined height.

// Fix Leaflet default icon issue in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

export default function RealMap({ towns }: { towns: any[] }) {
    useEffect(() => {
        L.Marker.prototype.options.icon = DefaultIcon;
    }, []);

    // Center on Hakusan area approx
    const center: [number, number] = [36.25, 136.65];

    return (
        <div className="w-full h-full min-h-[400px] pixel-box overflow-hidden rounded-lg">
            <MapContainer center={center} zoom={10} scrollWheelZoom={true} className="w-full h-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {towns.map((town) => (
                    <Marker key={town.id} position={[town.lat, town.lng]}>
                        <Popup>
                            <div className="font-sans text-black">
                                <h3 className="font-bold">{town.name}</h3>
                                <p>{town.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
