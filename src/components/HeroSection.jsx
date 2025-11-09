import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CAROUSEL_IMAGES = [
  "https://www.myscheme.gov.in/_next/image?url=https%3A%2F%2Fcdn.myscheme.in%2Fimages%2Fslideshow%2Fbanner3.webp&w=3840&q=75",
  "https://www.myscheme.gov.in/_next/image?url=https%3A%2F%2Fcdn.myscheme.in%2Fimages%2Fslideshow%2Fbanner5.webp&w=3840&q=75",
  "https://www.myscheme.gov.in/_next/image?url=https%3A%2F%2Fcdn.myscheme.in%2Fimages%2Fslideshow%2Fbanner2.webp&w=3840&q=75",
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
    <section className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#eefcf5] via-[#f6fff9] to-white px-4 py-16 text-center sm:px-6 sm:py-20 md:min-h-[80vh] lg:px-10 lg:pt-28 lg:pb-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="flex h-full min-h-[320px] w-full transition-transform duration-[1200ms] ease-out sm:min-h-full"
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
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/35 to-white/45 sm:from-white/50 sm:via-white/15 sm:to-white/25" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-[5]">
        <div className="absolute -top-16 -left-14 hidden h-56 w-56 rounded-3xl border border-dashed border-[#a6e6c4]/70 bg-[#e7fff0]/45 backdrop-blur-sm animate-pulse-soft sm:block" />
        <div className="absolute top-16 right-16 hidden h-64 w-64 rounded-full bg-white/50 shadow-soft-hero md:block animate-float-slow" />
        <div className="absolute bottom-12 left-1/3 hidden h-52 w-52 rounded-3xl bg-[#d8fbe6]/70 blur-2xl animate-float-rev lg:block" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 sm:max-w-4xl sm:gap-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-govBlue shadow-soft-hero/40 backdrop-blur-md animate-float-slow sm:gap-3 sm:px-4 sm:py-2 sm:text-sm">
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
              onClick={() => navigate("/local-issues")}
              className="w-full rounded-xl bg-gray-900 px-8 py-3 text-base font-semibold text-white shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 sm:w-auto"
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