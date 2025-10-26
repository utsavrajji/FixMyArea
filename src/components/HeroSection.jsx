import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center bg-[#FFEBE5] px-6 overflow-hidden">
      {/* Animated circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-orange-300 opacity-40 animate-float-slow"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-yellow-300 opacity-30 animate-float-slow-reverse"></div>
      <div className="absolute top-1/3 left-1/2 w-52 h-52 border-8 border-orange-500 rounded-full opacity-20 animate-pulse"></div>

      {/* Content */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-5 text-gray-900 max-w-4xl z-10">
        Your Voice for a Better Locality
      </h1>

      <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl z-10">
        Post local problems, let the community support them, and help the government solve them faster.
      </p>

      <div className="flex gap-6 flex-wrap justify-center z-10">
        <a href="/login">
           <button
          className="bg-orange-600 px-8 py-3 rounded-lg font-semibold text-white hover:bg-orange-700 transition shadow-lg"
        >
          Report an Issue
        </button>
        </a>
       
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-900 px-8 py-3 rounded-lg font-semibold text-white hover:bg-gray-800 transition shadow-lg"
        >
          View Local Issues
        </button>
      </div>

      {/* Background animation styles */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% {transform: translateY(0);}
          50% {transform: translateY(-20px);}
        }
        @keyframes floatSlowReverse {
          0%, 100% {transform: translateY(0);}
          50% {transform: translateY(20px);}
        }
        @keyframes pulse {
          0%, 100% {opacity: 0.2;}
          50% {opacity: 0.6;}
        }
        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }
        .animate-float-slow-reverse {
          animation: floatSlowReverse 10s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
