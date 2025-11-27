import { useState, useEffect } from "react";

const subIssueOptions = {
  "Road & Infrastructure": [
    "Pothole on road",
    "Broken footpath",
    "Street light not working",
    "Damaged bridge",
    "Missing road signs",
    "Other"
  ],
  "Garbage & Cleanliness": [
    "Garbage not collected",
    "Overflowing dustbin",
    "Illegal dumping",
    "No public toilets",
    "Littering in public area",
    "Other"
  ],
  "Water Supply": [
    "No water supply",
    "Contaminated water",
    "Leaking pipe",
    "Low water pressure",
    "Water wastage",
    "Other"
  ],
  "Electricity": [
    "Power outage",
    "Loose wire",
    "Transformer issue",
    "Illegal connection",
    "High electricity bill",
    "Other"
  ],
  "Environment & Parks": [
    "Tree cutting",
    "Park not maintained",
    "Air pollution",
    "Noise pollution",
    "Stray animals",
    "Other"
  ],
  "Traffic & Transport": [
    "Traffic jam",
    "No parking space",
    "Rash driving",
    "Broken traffic signal",
    "Public transport issue",
    "Other"
  ],
  "Safety & Security": [
    "Crime in area",
    "No police patrolling",
    "Unsafe streets",
    "Harassment",
    "Anti-social activity",
    "Other"
  ],
  "Public Buildings & Facilities": [
    "School building damaged",
    "Hospital not functional",
    "Government office closed",
    "Library not maintained",
    "Community center issue",
    "Other"
  ],
  "Housing Area Problems": [
    "Illegal construction",
    "Property dispute",
    "Unauthorized parking",
    "Building safety issue",
    "Encroachment",
    "Other"
  ],
  "Accessibility for Disabled": [
    "No ramp for wheelchair",
    "Inaccessible public toilet",
    "No disabled parking",
    "Inaccessible building",
    "No sign language support",
    "Other"
  ],
  "Drainage & Sewage": [
    "Blocked drain",
    "Open drainage",
    "Sewage overflow",
    "Foul smell",
    "Mosquito breeding",
    "Other"
  ],
  "Public Utilities": [
    "ATM not working",
    "No internet connectivity",
    "Post office closed",
    "Bank issue",
    "Ration shop problem",
    "Other"
  ],
  "Emergency / Urgent Issues": [
    "Fire hazard",
    "Flooding",
    "Building collapse risk",
    "Gas leak",
    "Medical emergency access blocked",
    "Other"
  ],
  "Community & Social Issues": [
    "Child labor",
    "Domestic violence",
    "Discrimination",
    "Substance abuse",
    "Homeless people issue",
    "Other"
  ],
  "Government Services": [
    "Aadhaar card issue",
    "Ration card problem",
    "Pension not received",
    "Birth/Death certificate delay",
    "Corruption/Bribery",
    "Other"
  ]
};

export default function SubIssueSelector({ category, subIssue, setSubIssue }) {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState("");

  // Check if this is a predefined category
  const isPredefinedCategory = subIssueOptions[category] !== undefined;
  
  // Reset when category changes
  useEffect(() => {
    setSubIssue("");
    setShowOtherInput(false);
    setOtherText("");
  }, [category, setSubIssue]);

  // If category is custom (not in subIssueOptions), don't render this component
  if (!isPredefinedCategory && category) {
    // Return info message instead
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 flex items-start gap-3 animate-fade-in">
        <span className="text-2xl">ℹ️</span>
        <div>
          <p className="font-semibold text-blue-900 mb-1">Custom Category Selected</p>
          <p className="text-sm text-blue-700">
            You've entered a custom category: <span className="font-bold">"{category}"</span>
            <br />
            Please describe the specific issue in detail in the description box below.
          </p>
        </div>
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

  const options = subIssueOptions[category] || [];

  const handleSelectChange = (e) => {
    const value = e.target.value;
    
    if (value === "Other") {
      setShowOtherInput(true);
      setSubIssue(""); // Clear until user types
    } else {
      setShowOtherInput(false);
      setOtherText("");
      setSubIssue(value);
    }
  };

  const handleOtherInputChange = (e) => {
    const value = e.target.value;
    setOtherText(value);
    setSubIssue(value); // Update subIssue with custom text
  };

  return (
    <div className="space-y-3">
      {/* Dropdown */}
      <select
        value={showOtherInput ? "Other" : subIssue}
        onChange={handleSelectChange}
        className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white font-medium"
        required
      >
        <option value="">-- Select specific issue --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Other Input Field */}
      {showOtherInput && (
        <div className="animate-fade-in">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Please specify the issue:
          </label>
          <input
            type="text"
            placeholder="Describe the specific issue..."
            value={otherText}
            onChange={handleOtherInputChange}
            className="w-full border-2 border-orange-300 rounded-xl p-4 text-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-orange-50 font-medium"
            required
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Be as specific as possible to help authorities understand the issue better
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
