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
      setActiveSlide((currentSlide) => (currentSlide + 1) % CAROUSEL_IMAGES.length);
    }, SLIDE_CHANGE_INTERVAL_MS);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#f0fff5] via-[#f6fff9] to-white px-6 text-center">
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
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-3xl border border-dashed border-[#a6e6c4]/70 bg-[#e7fff0]/50 backdrop-blur-sm animate-pulse-soft" />
        <div className="absolute top-16 right-24 hidden h-72 w-72 rounded-full bg-white/60 shadow-soft-hero md:block animate-float-slow" />
        <div className="absolute bottom-14 left-1/3 h-56 w-56 rounded-3xl bg-[#d8fbe6]/80 blur-2xl animate-float-rev" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 rounded-full bg-white/40 px-4 py-2 text-sm font-medium text-govBlue shadow-soft-hero/40 backdrop-blur-md animate-float-slow">
          <span className="block h-2 w-2 rounded-full bg-govGreen animate-pulse-soft" />
          Empowering citizen-led change
        </div>

        <div className="mt-51 rounded-[36px]   ">
          <h1 className="text-5xl md:text-6xl font-extrabold text-govText">
            Your Voice for a Better Locality
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Post local problems, let the community support them, and help the government solve them faster.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-8 py-3 font-semibold text-white shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Report an Issue
            </a>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700"
            >
              View Local Issues
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 shadow-soft-hero backdrop-blur-md">
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