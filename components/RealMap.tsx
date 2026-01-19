"use strict";
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import "@/components/leaflet-fix.css";

// Fix Leaflet default icon issue
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

// Controller for "Teku Teku" Location Feature
function LocationController({ active }: { active: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (active) {
            map.locate({ setView: true, maxZoom: 16 }).on("locationfound", function (e) {
                // Remove existing "Me" markers if any (simplified: just add new one)
                L.marker(e.latlng).addTo(map).bindPopup("YOU ARE HERE!").openPopup();
            });
        }
    }, [active, map]);
    return null;
}

export default function RealMap({ towns }: { towns: any[] }) {
    const [locateActive, setLocateActive] = useState(false);

    useEffect(() => {
        L.Marker.prototype.options.icon = DefaultIcon;
    }, []);

    const center: [number, number] = [36.25, 136.65];

    return (
        <div className="w-full h-full min-h-[400px] pixel-box overflow-hidden rounded-lg relative">
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
                                <p className="text-xs text-red-600 font-bold">{town.realSpotName}</p>
                                <p>{town.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                <LocationController active={locateActive} />
            </MapContainer>

            {/* Teku Teku Location Button Overlay */}
            <button
                className="absolute bottom-4 right-4 z-[1000] bg-white text-black p-3 rounded-full shadow-lg border-2 border-gray-400 active:scale-95 flex items-center gap-2 pixel-text hover:bg-gray-100"
                onClick={() => setLocateActive(true)}
            >
                <span className="text-xl">📍</span> <span className="text-xs font-bold">TEKU TEKU</span>
            </button>
        </div>
    );
}
