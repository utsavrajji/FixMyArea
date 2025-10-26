export default function StatusDropdown({ status, setStatus }) {
  const statuses = [
    "Pending",
    "Under Review",
    "Not Important",
    "Fake",
    "In Progress",
    "Resolved",
    "Rejected",
  ];
  return (
    <select
      value={status}
      onChange={e => setStatus(e.target.value)}
      className="px-2 py-1 border rounded text-xs bg-white"
    >
      {statuses.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
