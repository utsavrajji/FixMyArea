import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

function CtaSection() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  return (
    <section className="bg-[#064E3B] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 sm:text-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Join 5,000+ neighbors already making a difference
        </span>
        <h2 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
          Ready to improve <span className="text-emerald-300">your area?</span>
        </h2>
        <p className="mt-4 text-sm text-white/65 sm:text-base md:text-lg">
          It only takes 2 minutes to report an issue. Your neighbors are waiting
          to support you.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            onClick={() => navigate(user ? "/report-issue" : "/register")}
            className="w-full rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#064E3B] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto sm:text-base"
          >
            Get Started Now →
          </button>
          <button
            onClick={() => navigate("/local-issues")}
            className="w-full rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:w-auto sm:text-base"
          >
            Browse Local Issues
          </button>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
