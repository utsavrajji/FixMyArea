import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CAROUSEL_IMAGES = [
  "/assets/hero/img1.jpg",
  "/assets/hero/img2.jpg",
  "/assets/hero/img3.jpg",
];

const STATS = [
  { value: "1,200+", label: "Issues Reported" },
  { value: "850+", label: "Resolved" },
  { value: "5,000+", label: "Active Neighbors" },
  { value: "48", label: "Cities Covered" },
];

function Counter({ value }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/,/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

function HeroSection() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((s) => (s + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex w-full flex-col overflow-hidden bg-[#064E3B] min-h-[280px] sm:min-h-0 aspect-[4/3] sm:aspect-auto">
      {/* ── Background carousel ── */}
      <div className="absolute inset-0 -z-10">
        <div
          className="flex h-full w-full transition-transform duration-[1400ms] ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {CAROUSEL_IMAGES.map((img) => (
            <div key={img} className="h-full w-full flex-shrink-0">
              <img
                src={img}
                alt="Community"
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}
        </div>
        {/* subtle dark overlay to ensure text readability while keeping image clear */}
        <div className="absolute inset-0 bg-black/40 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/40 sm:to-black/40" />
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-6 text-center sm:gap-10 sm:px-6 sm:py-20 lg:py-28 lg:px-10">

        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-white/10 px-3 py-1 text-[10px] font-semibold text-emerald-200 backdrop-blur-sm sm:text-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Empowering citizen-led change
        </motion.div>

        {/* Headline */}
        <div className="space-y-2 sm:space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Your Voice for a{" "}
            <span className="text-emerald-300">Better Locality</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-[11px] text-white/75 sm:text-base md:text-lg lg:text-xl leading-relaxed"
          >
            Report local problems, let your community verify them, and watch the
            government take action.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-2 sm:flex-row sm:gap-4"
        >
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3.5 py-2 text-[10px] font-bold text-[#064E3B] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:px-8 sm:py-3.5 sm:text-base"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Report an Issue
          </a>
          <button
            onClick={() => navigate("/local-issues")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3.5 py-2 text-[10px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 sm:px-8 sm:py-3.5 sm:text-base"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            View Live Feed
          </button>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex gap-2">
          {CAROUSEL_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide ? "w-8 bg-white" : "w-3 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 border-t border-white/10 bg-[#053d2f]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-4 sm:grid-cols-4 sm:px-6 lg:px-10">
          {STATS.map(({ value, label }, index) => (
            <motion.div 
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="flex flex-col items-center justify-center gap-0.5 px-4 py-5"
            >
              <span className="text-2xl font-extrabold text-white sm:text-3xl">
                <Counter value={value} />
              </span>
              <span className="text-xs font-medium text-white/55 sm:text-sm">{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
