const SUB_ISSUES = {
  "Road & Infrastructure": [
    "Broken roads / potholes",
    "Damaged footpaths",
    "Open manholes",
    "Street lights not working",
    "Broken walls / benches",
    "Unfinished construction",
  ],
  "Garbage & Cleanliness": [
    "Garbage not collected",
    "Overflowing bins",
    "Illegal dumping",
    "Open drains",
    "Burning waste",
  ],
  "Water Supply": ["No supply", "Leakage", "Contaminated water"],
  "Electricity": ["Power outage", "Voltage fluctuation", "Street light issue"],
  // बाकी categories के लिए list add कर सकते हैं
};

export default function SubIssueSelector({ category, subIssue, setSubIssue }) {
  const list = SUB_ISSUES[category] || [];
  return (
    <div>
      <label className="block font-semibold mb-2">Specific Issue</label>
      <select
        className="w-full p-3 border rounded"
        value={subIssue}
        onChange={(e) => setSubIssue(e.target.value)}
        required
      >
        <option value="">Select specific issue</option>
        {list.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        <option value="Other">Other</option>
      </select>

      {subIssue === "Other" && (
        <input
          type="text"
          className="mt-2 w-full border rounded p-2"
          placeholder="Describe your issue"
          onChange={(e) => setSubIssue(e.target.value)}
          required
        />
      )}
    </div>
  );
}
