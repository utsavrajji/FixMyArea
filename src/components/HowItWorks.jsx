const STEPS = [
  {
    number: "01",
    icon: "📷",
    title: "Click Photo",
    desc: "Capture the issue with your phone camera. Our app auto-extracts the GPS location from the photo.",
    color: "text-[#064E3B]",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    numBg: "bg-[#064E3B]",
  },
  {
    number: "02",
    icon: "👥",
    title: "Community Verify",
    desc: "Neighbors see the issue in their Live Feed, upvote it and add verification comments to build credibility.",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
    numBg: "bg-amber-500",
  },
  {
    number: "03",
    icon: "⚡",
    title: "Fast Action",
    desc: "Trending issues are escalated to the right government department and resolved with status updates.",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-100",
    numBg: "bg-sky-600",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-fade bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#064E3B]/10 px-4 py-1.5 text-xs font-semibold text-[#064E3B] sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#064E3B]" />
            Step-by-step journey
          </span>
          <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            How It <span className="text-[#064E3B]">Works</span>
          </h2>
          <p className="mt-4 text-sm text-gray-500 sm:text-base">
            Simple 3-step process to make your locality better
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-6 sm:gap-8 md:grid-cols-3">
          {/* Connector */}
          <div className="pointer-events-none absolute top-10 left-[16.5%] right-[16.5%] hidden h-0.5 bg-gradient-to-r from-emerald-200 via-amber-200 to-sky-200 md:block" />

          {STEPS.map(({ number, icon, title, desc, bg, border, numBg }) => (
            <div key={number} className={`relative rounded-2xl border ${border} ${bg} p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`}>
              {/* Step number bubble */}
              <div className={`absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full ${numBg} text-sm font-bold text-white shadow-md`}>
                {number}
              </div>
              <div className="mt-4 mb-5 text-4xl">{icon}</div>
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed sm:text-base">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
