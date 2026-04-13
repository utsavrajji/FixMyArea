import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

/* ── Colour palette ──────────────────────────────────────────────────────── */
const PALETTE = [
  "#064E3B", "#065F46", "#047857", "#059669", "#10B981",
  "#34D399", "#1D4ED8", "#7C3AED", "#B45309", "#DC2626",
];

/* ── Safe location label ─────────────────────────────────────────────────── */
function getLocationLabel(issue) {
  const loc = issue.location;
  if (!loc) return null;
  if (typeof loc === "string" && loc.trim()) return loc.trim();
  if (typeof loc === "object") {
    // try each field in priority order
    const v =
      loc.district?.trim() ||
      loc.block?.trim() ||
      loc.village?.trim() ||
      loc.panchayat?.trim() ||
      loc.state?.trim() ||
      loc.houseNo?.trim();
    return v || null;
  }
  return null;
}

/* ── Safe state label ────────────────────────────────────────────────────── */
function getStateLabel(issue) {
  const loc = issue.location;
  if (!loc || typeof loc !== "object") return null;
  return loc.state?.trim() || null;
}

/* ── Clean category ──────────────────────────────────────────────────────── */
function getCategoryLabel(issue) {
  const raw = (issue.category || "").trim();
  if (!raw || raw === "undefined") return null;
  return raw.split(" - ")[0].trim();
}

/* ── Format month key → "Mar '26" ───────────────────────────────────────── */
function fmtMonth(ym) {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
}

/* ── Relative time ───────────────────────────────────────────────────────── */
function topN(obj, n = 7) {
  return Object.entries(obj)
    .filter(([k]) => k && k !== "null" && k !== "undefined")
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

/* ─────────────────────────── CHART COMPONENTS ─────────────────────────── */

/* Animated horizontal bar */
function HBar({ label, value, max, color, rank }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-[10px] font-bold text-gray-400 w-5 text-right flex-shrink-0">
        {rank}.
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700 truncate max-w-[75%]">{label}</span>
          <span className="text-xs font-black text-gray-900 ml-2 flex-shrink-0 tabular-nums">{value}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: color,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
              transitionDelay: `${rank * 80}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* SVG area + line chart for monthly */
function AreaChart({ data }) {
  // data: [{label, value}]
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-400 gap-2">
        <span className="text-3xl">📅</span>
        <p className="text-xs font-semibold">No monthly data available yet</p>
        <p className="text-[10px] text-gray-400">Data will appear as issues are reported</p>
      </div>
    );
  }

  const W = 560, H = 140;
  const padL = 32, padR = 16, padT = 20, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxV = Math.max(...data.map(d => d.value), 1);

  const pts = data.map((d, i) => ({
    x: padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
    y: padT + innerH - (d.value / maxV) * innerH,
    label: d.label,
    value: d.value,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${(H - padB).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(H - padB).toFixed(1)} Z`;

  // Y-axis guidelines
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    y: padT + innerH - f * innerH,
    val: Math.round(f * maxV),
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={t.y} x2={W - padR} y2={t.y} stroke="#F3F4F6" strokeWidth="1" />
            <text x={padL - 4} y={t.y + 3} textAnchor="end" fontSize="7" fill="#D1D5DB" fontFamily="Inter,sans-serif">
              {t.val}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#ag)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#064E3B" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Points + labels */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#064E3B" stroke="white" strokeWidth="2.5" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fill="#064E3B"
              fontWeight="bold" fontFamily="Inter,sans-serif">{p.value}</text>
            <text x={p.x} y={H - padB + 14} textAnchor="middle" fontSize="8" fill="#9CA3AF"
              fontFamily="Inter,sans-serif">{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* Donut chart */
function DonutChart({ entries, total }) {
  const R = 48, circ = 2 * Math.PI * R;
  let offset = 0;
  const slices = entries.slice(0, 6).map(([k, v], i) => {
    const arc = (v / total) * circ;
    const s = { k, v, pct: Math.round((v / total) * 100), arc, offset, color: PALETTE[i] };
    offset += arc;
    return s;
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex-shrink-0">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#F3F4F6" strokeWidth="16" />
          {slices.map((s, i) => (
            <circle key={i} cx="70" cy="70" r={R} fill="none"
              stroke={s.color} strokeWidth="16"
              strokeDasharray={`${s.arc} ${circ - s.arc}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt" />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-gray-900">{total}</span>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Total</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs font-semibold text-gray-700 flex-1 truncate">{s.k}</span>
            <span className="text-xs font-black text-gray-900 tabular-nums">{s.v}</span>
            <span className="text-[10px] text-gray-400 tabular-nums w-8 text-right">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* KPI card */
function KpiCard({ icon, label, value, sub, bg, border, text }) {
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 shadow-sm ${bg} ${border}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xl">{icon}</span>
        <span className={`text-3xl font-black tabular-nums ${text}`}>{value}</span>
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${text} opacity-60`}>{label}</p>
      {sub && <p className={`text-[10px] mt-1 ${text} opacity-50`}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function Analytics() {
  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "issues"),
      snap => {
        setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => { console.error("Analytics:", err); setLoading(false); }
    );
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading analytics…</p>
        </div>
      </div>
    );
  }

  /* ── Aggregate ── */
  const total    = issues.length;
  const resolved = issues.filter(i => i.status === "Resolved").length;
  const pending  = issues.filter(i => i.status === "Pending").length;
  const active   = issues.filter(i => ["In Progress", "Under Review"].includes(i.status)).length;
  const rejected = issues.filter(i => ["Rejected", "Fake"].includes(i.status)).length;
  const resRate  = total ? Math.round((resolved / total) * 100) : 0;

  const byArea = {}, byCat = {}, byStatus = {}, byMonth = {}, byState = {};

  issues.forEach(issue => {
    /* ── Location (district > block > village > state) ── */
    const loc = getLocationLabel(issue);
    if (loc) byArea[loc] = (byArea[loc] || 0) + 1;

    /* ── State ── */
    const st = getStateLabel(issue);
    if (st) byState[st] = (byState[st] || 0) + 1;

    /* ── Category ── */
    const cat = getCategoryLabel(issue);
    if (cat) byCat[cat] = (byCat[cat] || 0) + 1;

    /* ── Status ── */
    const status = issue.status || "Pending";
    byStatus[status] = (byStatus[status] || 0) + 1;

    /* ── Month — handle Firestore Timestamp AND plain JS date ── */
    let d = null;
    if (issue.createdAt?.toDate) {
      d = issue.createdAt.toDate();
    } else if (issue.createdAt?.seconds) {
      d = new Date(issue.createdAt.seconds * 1000);
    } else if (issue.createdAt) {
      d = new Date(issue.createdAt);
    }
    if (d && !isNaN(d.getTime())) {
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth[m] = (byMonth[m] || 0) + 1;
    }
  });

  const areaEntries   = topN(byArea, 8);
  const stateEntries  = topN(byState, 8);
  const catEntries    = topN(byCat, 8);
  const statusEntries = topN(byStatus, 8);

  /* Show state if distinct districts aren't available */
  const locationEntries = areaEntries.length > 0 ? areaEntries : stateEntries;
  const locationLabel   = areaEntries.length > 0 ? "District / Area" : "State-wise";

  const maxArea = locationEntries[0]?.[1] || 1;
  const maxCat  = catEntries[0]?.[1] || 1;

  /* Monthly chart data — sorted chronologically */
  const monthChartData = Object.entries(byMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([k, v]) => ({ label: fmtMonth(k), value: v }));

  return (
    <div className="space-y-5">

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard icon="📋" label="Total Issues"  value={total}    sub="All time"
          bg="bg-white" border="border-gray-200" text="text-gray-900" />
        <KpiCard icon="⏳" label="Pending"       value={pending}  sub="Awaiting action"
          bg="bg-amber-50" border="border-amber-200" text="text-amber-700" />
        <KpiCard icon="🔄" label="Active"        value={active}   sub="In Progress / Review"
          bg="bg-blue-50" border="border-blue-200" text="text-blue-700" />
        <KpiCard icon="✅" label="Resolved"      value={resolved} sub={`${resRate}% rate`}
          bg="bg-emerald-50" border="border-emerald-200" text="text-emerald-700" />
      </div>

      {/* ── Monthly Reports + Status Donut ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Monthly Reports</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Issues reported over time</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#064E3B]" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                {monthChartData.length} months
              </span>
            </div>
          </div>
          <AreaChart data={monthChartData} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-sm font-extrabold text-gray-900">Status Breakdown</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Distribution by current status</p>
          </div>
          {statusEntries.length > 0 ? (
            <DonutChart entries={statusEntries} total={total} />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 gap-2">
              <span className="text-3xl">📊</span>
              <p className="text-xs">No status data</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Category + Location bars ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Category */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Category Breakdown</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Top reported issue types</p>
            </div>
            <span className="text-lg">📂</span>
          </div>
          {catEntries.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {catEntries.map(([label, val], i) => (
                <HBar key={label} rank={i + 1} label={label} value={val} max={maxCat} color={PALETTE[i]} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-28 text-gray-400 gap-2">
              <span className="text-3xl">📂</span>
              <p className="text-xs">No category data yet</p>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">{locationLabel}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Most affected locations</p>
            </div>
            <span className="text-lg">📍</span>
          </div>
          {locationEntries.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {locationEntries.map(([label, val], i) => (
                <HBar key={label} rank={i + 1} label={label} value={val} max={maxArea} color="#1D4ED8" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-28 text-gray-400 gap-2">
              <span className="text-3xl">📍</span>
              <p className="text-xs font-semibold">No location data</p>
              <p className="text-[10px] text-center px-4">Make sure issues have state/district/block filled in</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Extras: Rejected + Resolution banner ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xl">🚫</span>
            <span className="text-3xl font-black text-red-700 tabular-nums">{rejected}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Rejected / Fake</p>
          <p className="text-[10px] mt-1 text-red-400">
            {total > 0 ? Math.round((rejected / total) * 100) : 0}% of total
          </p>
        </div>

        <div className="sm:col-span-2 bg-[#064E3B] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-white font-extrabold text-sm">Overall Resolution Rate</h3>
            <p className="text-emerald-300 text-xs mt-0.5">
              {resolved} of {total} issues resolved
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:w-40 h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${resRate}%`, transition: "width 1s ease" }} />
            </div>
            <span className="text-white text-2xl font-black flex-shrink-0 tabular-nums">{resRate}%</span>
          </div>
        </div>
      </div>

    </div>
  );
}
