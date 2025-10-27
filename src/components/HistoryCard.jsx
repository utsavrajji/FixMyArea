export default function HistoryCard({ issue }) {
  const {
    title, category, description, location, photoURL, createdAt, resolvedAt, status
  } = issue;
  const date = (resolvedAt?.toDate?.() || createdAt?.toDate?.() || null);
  const dateStr = date ? date.toLocaleString() : "";

  return (
    <div className="bg-white rounded-xl border shadow p-5 flex flex-col md:flex-row gap-4 items-start">
      {photoURL && (
        <img src={photoURL} alt={title}
          className="w-36 h-28 object-cover rounded border" />
      )}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold text-green-700">{title || "Untitled"}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-400">{status}</span>
        </div>
        <div className="text-sm text-gray-600 mb-1">Category: {category}</div>
        <div className="text-xs text-gray-500 mb-1">
          {Object.values(location || {}).filter(Boolean).join(", ")}
        </div>
        {description && (
          <div className="text-gray-800 mb-2">{description.slice(0, 120)}{description.length > 120 ? "..." : ""}</div>
        )}
        <div className="text-xs text-gray-500">Resolved On: {dateStr}</div>
      </div>
    </div>
  );
}
