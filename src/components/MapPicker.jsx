import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issues inside React
delete L.Icon.Default.prototype._getIconUrl;
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function LocationMarker({ position, setPosition, onSelect }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onSelect) onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom() < 15 ? 15 : map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position}></Marker>;
}

export default function MapPicker({ initialCoords, onLocationSelect }) {
  const [position, setPosition] = useState(
    initialCoords 
      ? { lat: initialCoords.lat, lng: initialCoords.lon || initialCoords.lng } 
      : { lat: 20.5937, lng: 78.9629 } // Default center: India
  );

  useEffect(() => {
    if (initialCoords) {
      setPosition({ lat: initialCoords.lat, lng: initialCoords.lon || initialCoords.lng });
    }
  }, [initialCoords]);

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-inner border-2 border-gray-200 z-0 relative">
      <MapContainer
        center={position}
        zoom={initialCoords ? 15 : 5}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
