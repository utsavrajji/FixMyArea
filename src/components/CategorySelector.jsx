import { useState, useEffect } from "react";

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
  "Other"
];

export default function CategorySelector({ category, setCategory }) {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState("");

  // Reset other input if category changes away from custom
  useEffect(() => {
    const isOtherSelected = category === "Other" || (category && !categories.slice(0, -1).includes(category));
    if (!isOtherSelected) {
      setShowOtherInput(false);
      setOtherText("");
    }
  }, [category]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    
    if (value === "Other") {
      setShowOtherInput(true);
      setCategory(""); // Clear until user types
    } else {
      setShowOtherInput(false);
      setOtherText("");
      setCategory(value);
    }
  };

  const handleOtherInputChange = (e) => {
    const value = e.target.value;
    setOtherText(value);
    setCategory(value); // Update category with custom text
  };

  return (
    <div className="space-y-3">
      {/* Dropdown */}
      <select
        value={showOtherInput ? "Other" : category}
        onChange={handleSelectChange}
        className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white font-medium"
        required
      >
        <option value="">-- Select a category --</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Other Input Field */}
      {showOtherInput && (
        <div className="animate-fade-in">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Please specify the category:
          </label>
          <input
            type="text"
            placeholder="e.g., Animal Welfare, Cultural Heritage, Sports Facilities..."
            value={otherText}
            onChange={handleOtherInputChange}
            className="w-full border-2 border-orange-300 rounded-xl p-4 text-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-orange-50 font-medium"
            required
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Describe the category of your issue clearly
          </p>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
