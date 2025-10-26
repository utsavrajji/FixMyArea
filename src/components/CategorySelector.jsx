const categories = [
  "Road & Infrastructure",
  "Garbage & Cleanliness",
  "Water Supply",
  "Electricity",
  "Environment & Parks",
  "Traffic & Transport",
  "Safety & Security",
  "Public Buildings & Facilities",
  "Housing Area Problems",
  "Accessibility for Disabled",
  "Drainage & Sewage",
  "Public Utilities",
  "Emergency / Urgent Issues",
  "Community & Social Issues",
  "Government Services",
];

export default function CategorySelector({ category, setCategory }) {
  return (
    <div>
      <label className="block font-semibold mb-2">Issue Category</label>
      <select
        className="w-full p-3 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select a category</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
