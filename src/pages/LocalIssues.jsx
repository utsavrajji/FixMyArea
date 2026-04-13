import { useState } from "react";
import Navbar from "../components/Navbar";
import IssueFeed from "../components/IssueFeed";
import LocationSelector from "../components/LocationSelector";
import Footer from "../components/Footer";
import { RefreshCw, Lightbulb, Map } from "lucide-react";

const INITIAL_LOCATION = { state: "", district: "", block: "", village: "", panchayat: "", pinCode: "" };

const CATEGORY_CHIPS = ["All", "Roads", "Water", "Electricity", "Sanitation", "Parks", "Safety"];

function LocalIssues() {
  const [location, setLocation] = useState(INITIAL_LOCATION);
  const [activeCategory, setActiveCategory] = useState("All");

  const handleReset = () => { setLocation(INITIAL_LOCATION); setActiveCategory("All"); };
  const shouldShowResults = Object.values(location).some((v) => v && v.trim());

  return (
    <>
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />

        {/* ── Page Header ── */}
        <div className="bg-[#064E3B] px-4 py-12 text-center sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live Community Feed
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
            Discover Local Issues
          </h1>
          <p className="mt-3 mx-auto max-w-xl text-sm text-white/65 sm:text-base">
            Find citizen-submitted reports around your neighbourhood and track their progress.
          </p>
        </div>

        {/* ── Category chips ── */}
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORY_CHIPS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#064E3B] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

          {/* ── Location Filter Card ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">Filter by Location</h2>
                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">Select your locality to find nearby reports</p>
              </div>
              <button onClick={handleReset}
                className="rounded-lg border border-[#064E3B]/20 bg-[#064E3B]/5 px-3 py-1.5 text-xs font-semibold text-[#064E3B] transition hover:bg-[#064E3B]/10">
                <RefreshCw className="w-3.5 h-3.5 mr-1 inline" /> Reset
              </button>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <LocationSelector location={location} setLocation={setLocation} />
            </div>
            <p className="mt-3 text-xs text-gray-400">
              <Lightbulb className="inline mr-1 text-yellow-500 w-4 h-4 -mt-0.5" /> Tip: PIN code gives the most precise results
            </p>
          </div>

          {/* ── Results Card ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  {shouldShowResults ? "Matching Reports" : "All Reports"}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  {shouldShowResults
                    ? "Showing issues that match your selected location"
                    : "Select a location above to filter by area"}
                </p>
              </div>
              {shouldShowResults && (
                <button onClick={handleReset}
                  className="self-start rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 sm:self-auto">
                  Clear Filters
                </button>
              )}
            </div>

            {shouldShowResults ? (
              <IssueFeed filterLocation={location} variant="summary" />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                <div className="flex justify-center mb-3 text-gray-300">
                  <Map className="w-12 h-12" />
                </div>
                <p className="text-sm font-medium text-gray-500">Select your state, district, or PIN code above</p>
                <p className="text-xs text-gray-400 mt-1">to find matching reports near you</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default LocalIssues;
