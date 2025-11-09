import { useState } from "react";
import Navbar from "../components/Navbar";
import IssueFeed from "../components/IssueFeed";
import LocationSelector from "../components/LocationSelector";
import Footer from "../components/Footer";

const INITIAL_LOCATION = {
  state: "",
  district: "",
  block: "",
  village: "",
  panchayat: "",
  pinCode: "",
};

function LocalIssues() {
  const [location, setLocation] = useState(INITIAL_LOCATION);

  const handleReset = () => {
    setLocation(INITIAL_LOCATION);
  };

  const shouldShowResults = Object.values(location).some((value) => value && value.trim());

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eefcf5] via-[#f6fff9] to-white">
        <Navbar />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-10 hidden h-72 w-72 rounded-[42px] border border-dashed border-[#a3e4c1]/70 bg-[#e7fff0]/60 backdrop-blur-md animate-pulse-soft md:block" />
          <div className="absolute top-32 right-20 hidden h-56 w-56 rounded-full bg-[#dff8eb]/90 blur-2xl lg:block animate-float-rev" />
          <div className="absolute bottom-12 left-1/4 hidden h-64 w-64 rounded-[36px] bg-white/60 shadow-soft-hero xl:block animate-float-slow" />
        </div>

        <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-3 pb-16 pt-24 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-28 lg:px-10 lg:pt-32">
        <div className="flex flex-col items-center text-center gap-4 sm:gap-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-govBlue shadow-soft-hero backdrop-blur sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-govGreen animate-pulse-soft" />
            Community Spotlight
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-govText sm:text-5xl md:text-6xl">
            Discover Local Issues
          </h1>
          <p className="max-w-2xl text-sm text-gray-700 sm:text-base">
            Find citizen-submitted applications around your neighbourhood and track their progress.
          </p>
        </div>

        <section className="space-y-6 rounded-[28px] border border-[#a3e4c1]/60 bg-gradient-to-br from-white/95 via-white/80 to-[#dff8eb]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="rounded-3xl bg-white/90 p-4 shadow-soft-hero sm:p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Filter by location</h2>
              <p className="text-xs text-gray-600 sm:text-sm">Use the quick selectors to find the locality you want to explore.</p>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white/85 p-3 shadow-inner sm:p-4">
                <LocationSelector location={location} setLocation={setLocation} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-medium text-gray-600 sm:max-w-lg">
                  Tip: Provide as many details as possible for precise results. PIN code offers the strongest match.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-orange-700 sm:w-auto"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#c7edd9]/80 bg-white/90 p-4 shadow-soft-hero sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Applications in focus</h2>
                <p className="text-sm text-gray-600">
                  {shouldShowResults
                    ? "Displaying citizen submissions that match your selected locality."
                    : "Select a location first to uncover the latest applications near you."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow-sm transition hover:border-gray-400 sm:w-auto"
              >
                Clear Selection
              </button>
            </div>

            <div className="mt-6">
              {shouldShowResults ? (
                <IssueFeed filterLocation={location} variant="summary" />
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-6 text-center text-sm font-medium text-gray-600 sm:p-8">
                  Start by selecting your state, district, or PIN code to look up matching applications.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      </div>
      <Footer />
    </>
  );
}

export default LocalIssues;
