const BENEFITS = [
  {
    icon: "🛰️",
    title: "GPS-Verified Reports",
    desc: "Every issue is geo-tagged automatically from photo metadata ensuring accurate, authentic location data.",
  },
  {
    icon: "📸",
    title: "Photo Evidence",
    desc: "Capture and upload photos directly. Visual proof makes reports more credible and actionable.",
  },
  {
    icon: "🔒",
    title: "OTP Security",
    desc: "Phone-verified accounts prevent spam and ensure a genuine, trusted community on the platform.",
  },
  {
    icon: "📊",
    title: "Real-time Analytics",
    desc: "Admin dashboards show live stats across categories so authorities can allocate resources efficiently.",
  },
];

function BenefitsSection() {
  return (
    <section className="scroll-fade bg-[#F3F4F6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Left: Illustration / visual ── */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://img.freepik.com/free-vector/mobile-marketing-concept-illustration_114360-1527.jpg"
                alt="Precision Engineering for Civic Good"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-[#064E3B]/90 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wide">Precision Engineering for Civic Good</p>
                <ul className="mt-2 space-y-1">
                  {["GPS Mapping", "Authentic Photos", "OTP Security"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right: Benefits list ── */}
          <div className="order-1 space-y-8 lg:order-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#064E3B]/10 px-4 py-1.5 text-xs font-semibold text-[#064E3B] sm:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#064E3B]" />
                Why citizens love FixMyArea
              </span>
              <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Benefits of Using{" "}
                <span className="text-[#064E3B]">FixMyArea</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
                Discover how the platform elevates transparency, speeds up
                resolutions, and keeps your community engaged.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {BENEFITS.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border border-white bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-3 text-2xl">{icon}</div>
                  <h3 className="mb-1.5 text-sm font-bold text-gray-900 sm:text-base">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed sm:text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
