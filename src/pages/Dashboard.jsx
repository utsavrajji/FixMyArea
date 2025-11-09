import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationSelector from "../components/LocationSelector";
import IssueFeed from "../components/IssueFeed";
import MyIssues from "../components/MyIssues";
import useUserProfile from "../hooks/useUserProfile";
import UserHeader from "../components/UserHeader";
import ProfileCard from "../components/ProfileCard";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState({
    state: "", district: "", block: "", village: "", panchayat: "", pinCode: "",
  });
  const [sort, setSort] = useState("recent");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();
  const { user, profile } = useUserProfile();

  const categories = [
    "All","Road & Infrastructure","Garbage & Cleanliness","Water Supply","Electricity",
    "Environment & Parks","Traffic & Transport","Safety & Security","Public Buildings & Facilities",
    "Housing Area Problems","Accessibility for Disabled","Drainage & Sewage","Public Utilities",
    "Emergency / Urgent Issues","Community & Social Issues","Government Services",
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top header with user badge + actions */}
        <UserHeader
          profile={{ ...profile, email: profile?.email || user?.email }}
          onReport={() => navigate("/report-issue")}
          onLogoutDone={() => navigate("/login")}
        />

        {/* Profile quick card */}
        <ProfileCard profile={{ ...profile, email: profile?.email || user?.email }} />

        {/* Location filter */}
        <div className="mt-2">
          <LocationSelector location={selectedLocation} setLocation={setSelectedLocation} />
        </div>

        {/* Sort + Category */}
        <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex gap-2 text-sm">
            <button onClick={() => setSort("recent")}
              className={`px-3 py-1 rounded border transition ${sort==="recent"?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-gray-300 hover:bg-gray-100"}`}>
              Recent
            </button>
            <button onClick={() => setSort("liked")}
              className={`px-3 py-1 rounded border transition ${sort==="liked"?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-gray-300 hover:bg-gray-100"}`}>
              Most Liked
            </button>
            <button onClick={() => setSort("near")}
              className={`px-3 py-1 rounded border transition ${sort==="near"?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-gray-300 hover:bg-gray-100"}`}>
              Near Me
            </button>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c==="All" ? "" : c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <IssueFeed filterLocation={selectedLocation} sort={sort} category={categoryFilter} />
            </div>
          </section>

          <aside className="md:col-span-1">
            <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">My Issues</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <MyIssues />
            </div>
          </aside>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
