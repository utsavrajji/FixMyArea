function BenefitsSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#f0fff5] via-[#f6fff9] to-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-12 h-56 w-56 rounded-3xl border border-dashed border-[#a6e6c4]/70 bg-[#e7fff0]/50 backdrop-blur-sm animate-pulse-soft" />
        <div className="absolute top-1/3 left-1/4 hidden h-44 w-44 rounded-3xl bg-white/60 shadow-soft-hero md:block animate-float-slow" />
        <div className="absolute bottom-10 right-12 h-36 w-36 rounded-full bg-[#d8fbe6]/80 blur-xl animate-float-rev" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          {/* Left - Visual */}
          <div className="order-2 md:order-1"> 
            <div className="relative">
              <div className="absolute -inset-6 rounded-[36px] border border-white/40 bg-gradient-to-br from-white via-white/70 to-[#c8f1da]/40 shadow-soft-hero backdrop-blur-md animate-float-rev" />
              <div className="relative rounded-[32px] overflow-hidden shadow-soft-hero">
                <img
                  src="https://img.freepik.com/free-vector/mobile-marketing-concept-illustration_114360-1527.jpg"
                  alt="Digital Governance"
                  className="w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                />
              </div>
            </div>
          </div>

          {/* Right - Benefits List */}
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-govBlue shadow-soft-hero/40 backdrop-blur-md animate-float-slow">
              <span className="block h-2 w-2 rounded-full bg-govGreen animate-pulse-soft" />
              Why citizens love FixMyArea
            </div>

            <h2 className="mt-6 text-3xl md:text-4xl font-bold text-govText">
              Benefits of Using <span className="text-govBlue">FixMyArea</span>
            </h2>

            <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600">
              Discover how the platform elevates transparency, speeds up resolutions, and keeps your community engaged.
            </p>

            <div className="mt-10 space-y-6">
              <div className="relative flex items-start gap-4 rounded-2xl bg-white/85 p-5 shadow-xl backdrop-blur-md transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-govGreen/20 text-3xl">🔍</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-govText">Complete Transparency</h3>
                  <p className="mt-1 text-gray-600">
                    See real-time status updates and know exactly what's happening with your complaint
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-4 rounded-2xl bg-white/85 p-5 shadow-xl backdrop-blur-md transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-govBlue/20 text-3xl">🚀</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-govText">Faster Action</h3>
                  <p className="mt-1 text-gray-600">
                    Trending issues get prioritized, ensuring urgent problems are solved quickly
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-4 rounded-2xl bg-white/85 p-5 shadow-xl backdrop-blur-md transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-govGreen/20 text-3xl">👥</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-govText">Community Participation</h3>
                  <p className="mt-1 text-gray-600">
                    Join forces with neighbors to highlight shared problems and demand action
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-4 rounded-2xl bg-white/85 p-5 shadow-xl backdrop-blur-md transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-govBlue/20 text-3xl">📊</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-govText">Digital Record</h3>
                  <p className="mt-1 text-gray-600">
                    Maintain permanent records of all issues and resolutions for future reference
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
