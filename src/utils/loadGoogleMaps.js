// src/utils/loadGoogleMaps.js
let loaderPromise = null;

export function loadGoogleMaps(libraries = "places") {
  if (loaderPromise) return loaderPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn("Google Maps API key missing. Set VITE_GOOGLE_MAPS_API_KEY in .env.local");
  }

  loaderPromise = new Promise((resolve, reject) => {
    // Already loaded?
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });

  return loaderPromise;
}
