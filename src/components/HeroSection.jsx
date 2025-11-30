import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CAROUSEL_IMAGES = [
  "/assets/hero/img1.png",
  "/assets/hero/img2.png",
  "/assets/hero/img3.png",
];

const SLIDE_CHANGE_INTERVAL_MS = 4000;

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
    <section className="relative isolate w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      {/* Background Carousel */}
      <div className="absolute inset-0 -z-10">
        <div
          className="flex h-full w-full transition-transform duration-[1500ms] ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {CAROUSEL_IMAGES.map((image, idx) => (
            <div key={idx} className="relative h-full w-full flex-shrink-0">
              <img
                src={image}
                alt={`Community improvement ${idx + 1}`}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-orange-900/40 to-transparent" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 backdrop-blur-[2px]" />
      </div>

      {/* Animated Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 -z-5">
        {/* Top Left */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-orange-200/40 to-orange-400/20 blur-3xl animate-pulse-slow" />
        
        {/* Top Right */}
        <div className="absolute -top-10 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-blue-300/30 to-blue-500/20 blur-3xl animate-float-slow" />
        
        {/* Bottom Left */}
        <div className="absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-gradient-to-br from-green-300/25 to-green-500/15 blur-2xl animate-float-reverse" />
        
        {/* Bottom Right */}
        <div className="absolute bottom-10 -right-10 h-80 w-80 rounded-full bg-gradient-to-br from-purple-200/20 to-purple-400/10 blur-3xl animate-pulse-slow" />

        {/* Geometric Shapes */}
        <div className="absolute top-32 right-1/4 hidden lg:block">
          <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-orange-300/40 bg-white/20 backdrop-blur-sm animate-float-slow rotate-12" />
        </div>
        
        <div className="absolute bottom-32 left-1/3 hidden lg:block">
          <div className="h-20 w-20 rounded-full border-2 border-dashed border-blue-300/40 bg-white/20 backdrop-blur-sm animate-float-reverse" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col items-center justify-center text-center space-y-10">
          
          {/* Badge */}
          <div className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-200/40 px-5 py-2.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:scale-105">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500"></span>
            </span>
            <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Empowering Citizen-Led Change Across India
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-orange-900 bg-clip-text text-transparent">
                Your Voice for a
              </span>
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Better Locality
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C100 2 200 2 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl lg:text-2xl font-medium">
              Post local problems, let the community support them, and help the government solve them faster with transparency.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="/login"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report an Issue
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-700 to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>

            <button
              onClick={() => navigate("/local-issues")}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white border-2 border-slate-200 px-8 py-4 text-base font-bold text-slate-900 shadow-xl transition-all duration-300 hover:scale-105 hover:border-slate-300 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Local Issues
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-50 to-slate-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>

          {/* Stats/Features Row */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
            {[
              { icon: "📊", stat: "1000+", label: "Issues Reported" },
              { icon: "✅", stat: "85%", label: "Resolution Rate" },
              { icon: "👥", stat: "5000+", label: "Active Citizens" }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/80"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  {item.stat}
                </div>
                <div className="text-sm font-semibold text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex gap-2 mt-8">
            {CAROUSEL_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeSlide 
                    ? 'w-8 bg-gradient-to-r from-orange-500 to-orange-600' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
