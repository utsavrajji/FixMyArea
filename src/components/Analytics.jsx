import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Analytics() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "issues"));
      const all = snap.docs.map(d => d.data());
      let area = {}, cat = {}, month = {};
      all.forEach((d) => {
        const keyArea = d.location?.district || "--";
        area[keyArea] = (area[keyArea] || 0) + 1;
        cat[d.category] = (cat[d.category] || 0) + 1;
        if (d.createdAt?.toDate) {
          const m = d.createdAt.toDate().toISOString().slice(0, 7);
          month[m] = (month[m] || 0) + 1;
        }
      });
      setStats({ area, cat, month });
    };
    load();
  }, []);

  return (
    <div>
      <div className="font-bold text-xl mb-4">Analytics</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Area-wise (District)" data={stats.area} />
        <StatCard title="Category-wise" data={stats.cat} />
        <StatCard title="Monthly Reported" data={stats.month} />
      </div>
    </div>
  );
}
function StatCard({ title, data = {} }) {
  const entries = Object.entries(data);
  return (
    <div className="bg-white rounded-xl border shadow p-4">
      <div className="font-semibold mb-2">{title}</div>
      {!entries.length && <div className="text-xs text-gray-400">No data</div>}
      <ul className="text-sm space-y-1">
        {entries.map(([k, v]) => (
          <li key={k}>
            <span className="font-medium">{k}</span>: {v}
          </li>
        ))}
      </ul>
    </div>
  );
}
