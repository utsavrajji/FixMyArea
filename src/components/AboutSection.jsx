function AboutSection() {
  const cards = [
    {
      emoji: "🗣️",
      title: "Citizens Voice Heard",
      desc: "Every citizen gets a platform to report and track local issues easily",
      bg: "bg-white",
      border: "border-gray-100",
      iconBg: "bg-emerald-50",
    },
    {
      emoji: "⚡",
      title: "Faster Response",
      desc: "Government departments get instant notifications for urgent issues",
      bg: "bg-white",
      border: "border-gray-100",
      iconBg: "bg-amber-50",
    },
    {
      emoji: "👁️",
      title: "Transparent Tracking",
      desc: "Track your issue status from submission to resolution in real-time",
      bg: "bg-white",
      border: "border-gray-100",
      iconBg: "bg-sky-50",
    },
    {
      emoji: "🤝",
      title: "Community Power",
      desc: "Upvote and verify issues to help prioritize what matters most",
      bg: "bg-white",
      border: "border-gray-100",
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <section className="scroll-fade bg-[#F3F4F6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#064E3B]/10 px-4 py-1.5 text-xs font-semibold text-[#064E3B] sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#064E3B]" />
            Why FixMyArea stands out
          </span>
          <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Why <span className="text-[#064E3B]">FixMyArea?</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm text-gray-500 sm:text-base">
            Bridging the gap between citizens and government for faster resolution
            of local issues
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.map(({ emoji, title, desc, bg, border, iconBg }) => (
            <div
              key={title}
              className={`group relative rounded-2xl border ${border} ${bg} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md`}
            >
              <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} text-3xl`}>
                {emoji}
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
