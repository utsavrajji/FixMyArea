function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-16 bg-gradient-to-b from-[#f3fff6] via-white to-[#f8fff8] scroll-fade sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-12 hidden h-64 w-64 rounded-[42px] border border-dashed border-[#a3e4c1]/70 bg-[#e7fff0]/60 backdrop-blur-sm animate-pulse-soft sm:block" />
        <div className="absolute top-1/3 right-[18%] hidden h-40 w-40 rounded-full bg-[#dff8eb]/90 blur-2xl md:block animate-float-rev" />
        <div className="absolute bottom-0 left-1/3 hidden h-48 w-48 rounded-[36px] bg-white/60 shadow-soft-hero md:block animate-float-slow" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="mb-12 text-center sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-govBlue shadow-soft-hero/50 backdrop-blur sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-govGreen animate-pulse-soft" />
            Step-by-step journey
          </span>
          <h2 className="mt-6 text-2xl font-bold text-govText sm:text-3xl md:text-4xl">
            How It <span className="text-govBlue">Works</span>
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Simple 3-step process to make your locality better
          </p>
        </div>

        <div className="relative grid gap-8 sm:gap-10 md:grid-cols-3 md:items-stretch">
          {/* Connector line */}
          <div className="pointer-events-none absolute top-[52%] left-[12%] right-[12%] hidden h-1 bg-gradient-to-r from-[#c8f3d9] via-[#9ddfbb] to-[#63c4ff]/50 shadow-soft-hero md:block" />

          {/* Step 1 */}
          <div className="relative">
            <div className="group relative h-full rounded-3xl bg-white/85 p-8 text-center shadow-xl backdrop-blur-md transition-all duration-500 sm:p-10 md:hover:-translate-y-2 md:hover:shadow-2xl">
              <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-govBlue to-govBlue/80 text-white text-xl font-bold shadow-lg">
                1
              </div>
              <div className="mt-6 sm:mt-4">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-govBlue/10 text-4xl transition-transform duration-500 md:group-hover:scale-110">
                  📝
                </div>
                <h3 className="mb-3 text-xl font-bold text-govText sm:text-2xl">Post Your Issue</h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  Report any local problem with a photo and description. Select your area and category.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="group relative h-full rounded-3xl bg-white/85 p-8 text-center shadow-xl backdrop-blur-md transition-all duration-500 sm:p-10 md:hover:-translate-y-2 md:hover:shadow-2xl">
              <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-govGreen to-govGreen/80 text-white text-xl font-bold shadow-lg">
                2
              </div>
              <div className="mt-6 sm:mt-4">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-govGreen/10 text-4xl transition-transform duration-500 md:group-hover:scale-110">
                  👍
                </div>
                <h3 className="mb-3 text-xl font-bold text-govText sm:text-2xl">Community Upvotes</h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  Other citizens upvote, comment, and verify the issue to increase visibility.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="group relative h-full rounded-3xl bg-white/85 p-8 text-center shadow-xl backdrop-blur-md transition-all duration-500 sm:p-10 md:hover:-translate-y-2 md:hover:shadow-2xl">
              <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-govBlue to-govBlue/80 text-white text-xl font-bold shadow-lg">
                3
              </div>
              <div className="mt-6 sm:mt-4">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-govBlue/10 text-4xl transition-transform duration-500 md:group-hover:scale-110">
                  ✅
                </div>
                <h3 className="mb-3 text-xl font-bold text-govText sm:text-2xl">Government Solves</h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  Government reviews, takes action, and marks the issue as resolved with updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
