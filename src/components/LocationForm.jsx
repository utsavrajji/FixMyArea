import PlaceAutocomplete from "./PlaceAutocomplete";

export default function LocationForm({ location, setLocation, setLocationCoords }) {
  const detectGPS = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        alert("Error fetching location: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const handleAutoSelect = ({ address, lat, lon }) => {
    setLocationCoords({ lat, lon, accuracy: 50 });
    setLocation({ ...location, houseNo: address });
  };

  return (
    <div className="space-y-2">
      <label className="block font-semibold mb-1">Location Details</label>

      <PlaceAutocomplete placeholder="Search address or place" onSelect={handleAutoSelect} />
      <div className="text-xs text-gray-500">
        Tip: ऊपर से exact location चुनें, या GPS से auto-detect करें.
      </div>

      <button
        type="button"
        onClick={detectGPS}
        className="bg-orange-600 text-white px-3 py-1 rounded mb-1 hover:bg-orange-700 transition text-xs"
      >
        Auto-detect via GPS
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" placeholder="State" value={location.state}
          onChange={(e) => setLocation({ ...location, state: e.target.value })}
          className="border p-2 rounded" required />

        <input type="text" placeholder="District" value={location.district}
          onChange={(e) => setLocation({ ...location, district: e.target.value })}
          className="border p-2 rounded" required />

        <input type="text" placeholder="Block / Tehsil" value={location.block}
          onChange={(e) => setLocation({ ...location, block: e.target.value })}
          className="border p-2 rounded" />

        <input type="text" placeholder="Village / Town / City" value={location.village}
          onChange={(e) => setLocation({ ...location, village: e.target.value })}
          className="border p-2 rounded" />

        <input type="text" placeholder="Panchayat / Ward / Municipality" value={location.panchayat}
          onChange={(e) => setLocation({ ...location, panchayat: e.target.value })}
          className="border p-2 rounded" />

        <input type="text" placeholder="House No. / Street / Landmark" value={location.houseNo}
          onChange={(e) => setLocation({ ...location, houseNo: e.target.value })}
          className="border p-2 rounded" />

        <input type="text" placeholder="PIN Code" value={location.pinCode}
          onChange={(e) => setLocation({ ...location, pinCode: e.target.value })}
          className="border p-2 rounded" required />

        <input type="text" placeholder="Mobile Number" value={location.mobile}
          onChange={(e) => setLocation({ ...location, mobile: e.target.value })}
          className="border p-2 rounded" />
      </div>
    </div>
  );
}
