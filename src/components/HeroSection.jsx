import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CAROUSEL_IMAGES = [
  "https://www.myscheme.gov.in/_next/image?url=https%3A%2F%2Fcdn.myscheme.in%2Fimages%2Fslideshow%2Fbanner3.webp&w=3840&q=75",
  "https://www.myscheme.gov.in/_next/image?url=https%3A%2F%2Fcdn.myscheme.in%2Fimages%2Fslideshow%2Fbanner5.webp&w=3840&q=75",
  "https://www.myscheme.gov.in/_next/image?url=https%3A%2F%2Fcdn.myscheme.in%2Fimages%2Fslideshow%2Fbanner2.webp&w=3840&q=75",
];

const SLIDE_CHANGE_INTERVAL_MS = 7000;

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
    <section className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#eefcf5] via-[#f6fff9] to-white px-4 text-center min-h-[100dvh] sm:px-6 sm:min-h-[85vh] lg:px-8 lg:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt="Local community improvements"
              className="h-full w-full object-cover object-center sm:object-[50%_45%] md:object-center"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/30 to-white/40 sm:from-white/45 sm:via-white/15 sm:to-white/25" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-[5]">
        <div className="absolute -top-16 -left-14 hidden h-56 w-56 rounded-3xl border border-dashed border-[#a6e6c4]/70 bg-[#e7fff0]/45 backdrop-blur-sm animate-pulse-soft sm:block" />
        <div className="absolute top-16 right-16 hidden h-64 w-64 rounded-full bg-white/50 shadow-soft-hero md:block animate-float-slow" />
        <div className="absolute bottom-12 left-1/3 hidden h-52 w-52 rounded-3xl bg-[#d8fbe6]/70 blur-2xl animate-float-rev lg:block" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl space-y-8 sm:space-y-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-1.5 text-xs font-medium text-govBlue shadow-soft-hero/40 backdrop-blur-md animate-float-slow sm:gap-3 sm:px-4 sm:py-2 sm:text-sm">
          <span className="block h-2 w-2 rounded-full bg-govGreen animate-pulse-soft" />
          Empowering citizen-led change
        </div>

        <div className="space-y-6 rounded-[28px] sm:space-y-8">
          <h1 className="text-4xl font-extrabold leading-tight text-govText sm:text-5xl md:text-6xl">
            Your Voice for a Better Locality
          </h1>

          <p className="mx-auto max-w-3xl text-base text-gray-700 sm:text-lg md:text-2xl">
            Post local problems, let the community support them, and help the government solve them faster.
          </p>

          <div className="flex w-full flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-8 py-3 text-base font-semibold text-white shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:w-auto"
            >
              Report an Issue
            </a>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-xl bg-gray-900 px-8 py-3 text-base font-semibold text-white shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 sm:w-auto"
            >
              View Local Issues
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 flex w-full -translate-x-1/2 justify-center px-6 sm:bottom-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-2 shadow-soft-hero backdrop-blur-md sm:gap-2 sm:px-4">
          {CAROUSEL_IMAGES.map((_, index) => (
            <button
              key={`carousel-indicator-${index}`}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-govGreen ${
                index === activeSlide
                  ? "bg-govGreen scale-110 shadow-sm"
                  : "bg-gray-400/60 hover:bg-gray-500/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;