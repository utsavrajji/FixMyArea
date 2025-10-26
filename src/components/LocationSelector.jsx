// Simple cascading selects; replace with your data source later.
const STATES = ["Jharkhand", "Bihar", "West Bengal"];

const DISTRICTS = {
  Jharkhand: ["Ranchi", "Dhanbad", "Jamshedpur"],
  Bihar: ["Patna", "Gaya"],
  "West Bengal": ["Kolkata", "Howrah"],
};

const BLOCKS = {
  Dhanbad: ["Dhanbad Sadar", "Govindpur", "Topchanchi"],
  Ranchi: ["Kanke", "Ratu"],
  Patna: ["Patna Sadar"],
  Kolkata: ["Kolkata North", "Kolkata South"],
};

export default function LocationSelector({ location, setLocation }) {
  const { state, district, block, village, panchayat, pinCode } = location;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={state}
        onChange={(e) =>
          setLocation({ state: e.target.value, district: "", block: "", village: "", panchayat: "", pinCode: "" })
        }
        className="border rounded px-3 py-2"
      >
        <option value="">State</option>
        {STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={district}
        onChange={(e) => setLocation({ ...location, district: e.target.value, block: "", village: "", panchayat: "" })}
        className="border rounded px-3 py-2"
        disabled={!state}
      >
        <option value="">District</option>
        {(DISTRICTS[state] || []).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        value={block}
        onChange={(e) => setLocation({ ...location, block: e.target.value })}
        className="border rounded px-3 py-2"
        disabled={!district}
      >
        <option value="">Block / Tehsil</option>
        {(BLOCKS[district] || []).map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="City / Village"
        value={village}
        onChange={(e) => setLocation({ ...location, village: e.target.value })}
        className="border rounded px-3 py-2"
      />

      <input
        type="text"
        placeholder="Panchayat / Ward"
        value={panchayat}
        onChange={(e) => setLocation({ ...location, panchayat: e.target.value })}
        className="border rounded px-3 py-2"
      />

      <input
        type="text"
        placeholder="PIN Code"
        value={pinCode}
        onChange={(e) => setLocation({ ...location, pinCode: e.target.value })}
        className="border rounded px-3 py-2"
      />
    </div>
  );
}
