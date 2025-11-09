// src/components/PlaceAutocomplete.jsx
import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";

export default function PlaceAutocomplete({ placeholder = "Search place", onSelect }) {
  const inputRef = useRef(null);

  useEffect(() => {
    let autocomplete;
    let mounted = true;

    loadGoogleMaps("places")
      .then((gmaps) => {
        if (!mounted || !inputRef.current) return;
        autocomplete = new gmaps.places.Autocomplete(inputRef.current, {
          fields: ["geometry", "formatted_address", "name", "address_components"],
          componentRestrictions: { country: "in" },
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place || !place.geometry) return;
          const lat = place.geometry.location.lat();
          const lon = place.geometry.location.lng();
          onSelect?.({
            name: place.name,
            address: place.formatted_address,
            lat,
            lon,
            addressComponents: place.address_components ?? [],
          });
        });
      })
      .catch(() => {
        // silently ignore; maybe offline or key not enabled
      });

    return () => {
      mounted = false;
    };
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className="border rounded px-3 py-2 w-full"
    />
  );
}
