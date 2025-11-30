import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CAROUSEL_IMAGES = [
  "/assets/hero/img1.jpg",
  "/assets/hero/img2.jpg",
  "/assets/hero/img3.jpg",
];

const SLIDE_CHANGE_INTERVAL_MS = 3000;

function HeroSection() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(currentSlide => (currentSlide + 1) % CAROUSEL_IMAGES.length);
    }, SLIDE_CHANGE_INTERVAL_MS);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
<section className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#eefcf5] via-[#f6fff9] to-white px-3 py-10 text-center sm:px-6 sm:py-16 md:min-h-[80vh] lg:px-10 lg:pt-28 lg:pb-24">
  {/* Carousel Background */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div
      className="flex h-full min-h-[200px] w-full transition-transform duration-[1200ms] ease-out sm:min-h-[320px] md:min-h-full"
      style={{ transform: `translateX(-${activeSlide * 100}%)` }}
    >
      {CAROUSEL_IMAGES.map((image) => (
        <div key={image} className="flex h-full w-full flex-shrink-0">
          <img
            src={image}
            alt="Local community improvements"
            className="h-full w-full object-cover object-center md:object-[50%_45%]"
          />
        </div>
      ))}
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/45 to-white/55 sm:from-white/60 sm:via-white/25 sm:to-white/30" />
  </div>

  <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 sm:max-w-4xl sm:gap-8">
    {/* Small badge text */}
    <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-govBlue shadow-soft-hero/40 backdrop-blur-md sm:text-xs md:text-sm">
      <span className="block h-2 w-2 rounded-full bg-govGreen animate-pulse-soft" />
      <span>Empowering citizen-led change</span>
    </div>

    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Your Voice for a Better Locality */}
      <h1 className="text-2xl font-extrabold leading-tight text-govText sm:text-3xl md:text-4xl lg:text-5xl">
        Your Voice for a <span className="text-orange-600">Better Locality</span>
      </h1>

      <p className="mx-auto max-w-3xl text-[13px] text-gray-700 leading-relaxed sm:text-sm md:text-base lg:text-lg">
        Post local problems, let the community support them, and help the government solve them faster.
      </p>

      {/* Buttons */}
      <div className="flex w-full flex-col items-stretch justify-center gap-2.5 pt-2 sm:flex-row sm:items-center sm:gap-4 md:gap-6 md:pt-4">
        {/* Report an Issue */}
        <a
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-5 py-2 text-xs font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm md:px-8 md:py-3 md:text-base"
        >
          Report an Issue
        </a>

        {/* View Local Issues */}
        <button
          onClick={() => navigate("/local-issues")}
          className="w-full rounded-lg bg-gray-900 px-5 py-2 text-xs font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm md:px-8 md:py-3 md:text-base"
        >
          View Local Issues
        </button>
      </div>
    </div>
  </div>
</section>

  );
}

export default HeroSection;
