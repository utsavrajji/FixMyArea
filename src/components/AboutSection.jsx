function AboutSection() {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-[#f0fff5] via-[#f6fff9] to-white scroll-fade sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-12 hidden h-56 w-56 rounded-3xl border border-dashed border-[#a6e6c4]/70 bg-[#e7fff0]/50 backdrop-blur-sm animate-pulse-soft sm:block" />
        <div className="absolute top-1/4 right-24 hidden h-48 w-48 rounded-full bg-white/60 shadow-soft-hero md:block animate-float-slow" />
        <div className="absolute bottom-8 left-1/3 hidden h-40 w-40 rounded-3xl bg-[#d8fbe6]/80 blur-xl animate-float-rev md:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-govBlue shadow-soft-hero/40 backdrop-blur-md animate-float-slow sm:text-sm">
            <span className="block h-2 w-2 rounded-full bg-govGreen animate-pulse-soft" />
            Why FixMyArea stands out
          </div>

          <h2 className="mt-6 text-2xl font-bold text-govText sm:text-3xl md:text-4xl">
            Why <span className="text-govBlue">FixMyArea?</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            Bridging the gap between citizens and government for faster resolution of local issues
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Benefit 1 */}
          <div className="relative rounded-2xl border border-white/40 bg-white/85 p-6 text-center shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-govBlue/15 via-white to-govGreen/15 shadow-soft-hero">
              <span className="text-3xl">🗣️</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-govText sm:text-xl">Citizens Voice Heard</h3>
            <p className="text-sm text-gray-600 sm:text-base">
              Every citizen gets a platform to report and track local issues easily
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="relative rounded-2xl border border-white/40 bg-white/85 p-6 text-center shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-govGreen/20 via-white to-govBlue/10 shadow-soft-hero">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-govText sm:text-xl">Faster Response</h3>
            <p className="text-sm text-gray-600 sm:text-base">
              Government departments get instant notifications for urgent issues
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="relative rounded-2xl border border-white/40 bg-white/85 p-6 text-center shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-govBlue/15 via-white to-govGreen/15 shadow-soft-hero">
              <span className="text-3xl">👁️</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-govText sm:text-xl">Transparent Tracking</h3>
            <p className="text-sm text-gray-600 sm:text-base">
              Track your issue status from submission to resolution in real-time
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="relative rounded-2xl border border-white/40 bg-white/85 p-6 text-center shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-govGreen/20 via-white to-govBlue/10 shadow-soft-hero">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-govText sm:text-xl">Community Power</h3>
            <p className="text-sm text-gray-600 sm:text-base">
              Upvote and verify issues to help prioritize what matters most
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
