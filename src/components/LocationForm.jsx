export default function LocationForm({ location, setLocation }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">
        Location information applies automatically from map coordinates. Verify below:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" placeholder="State" value={location.state || ""}
          readOnly className="border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200" required />

        <input type="text" placeholder="District" value={location.district || ""}
          readOnly className="border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200" required />

        <input type="text" placeholder="Block / Tehsil" value={location.block || ""}
          readOnly className="border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200" />

        <input type="text" placeholder="Village / Town / City" value={location.village || ""}
          onChange={(e) => setLocation({ ...location, village: e.target.value })}
          className="border p-2 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />

        <input type="text" placeholder="Panchayat / Ward / Municipality" value={location.panchayat || ""}
          onChange={(e) => setLocation({ ...location, panchayat: e.target.value })}
          className="border p-2 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />

        <input type="text" placeholder="House No. / Street / Landmark" value={location.houseNo || ""}
          onChange={(e) => setLocation({ ...location, houseNo: e.target.value })}
          className="border p-2 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />

        <input type="text" placeholder="PIN Code" value={location.pinCode || ""}
          onChange={(e) => setLocation({ ...location, pinCode: e.target.value })}
          className="border p-2 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" required />

        <input type="text" placeholder="Mobile Number" value={location.mobile || ""}
          onChange={(e) => setLocation({ ...location, mobile: e.target.value })}
          className="border p-2 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
      </div>
    </div>
  );
}
