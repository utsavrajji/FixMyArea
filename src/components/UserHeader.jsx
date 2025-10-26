import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0,2).map(p=>p[0]?.toUpperCase()).join("") || "U";
}

export default function UserHeader({ profile, onReport, onLogoutDone }) {
  const name = profile?.name || profile?.fullName || "Citizen";
  const email = profile?.email || profile?.userEmail || auth.currentUser?.email || "";
  const role = profile?.role || "User";
  const joined = profile?.createdAt?.toDate?.()?.toLocaleDateString?.() || "";

  const logout = async () => {
    try {
      await signOut(auth);
      onLogoutDone?.();
    } catch (e) {
      alert("Logout failed: " + e.message);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {profile?.photoURL ? (
          <img src={profile.photoURL} alt="dp" className="w-10 h-10 rounded-full object-cover border" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            {initials(name)}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{email}</div>
          {!!joined && <div className="text-[11px] text-gray-400">Joined {joined} • {role}</div>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onReport}
          className="px-3 py-2 rounded bg-orange-600 text-white text-sm hover:bg-orange-700"
        >
          Report an Issue
        </button>
        <button
          onClick={logout}
          className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
