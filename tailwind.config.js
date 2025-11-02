// tailwind.config.js
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { green:"#7ed957", mint:"#b8f1b0", dark:"#155e3b", blue:"#1a73e8" }
      },
      backgroundImage: {
        "hero-gradient":"linear-gradient(180deg,#b8f1b0 0%,#7ed957 45%,#61cf54 100%)"
      },
      boxShadow: {
        "soft-hero":"0 20px 60px rgba(0,0,0,0.15)"
      },
      keyframes: {
        heroSlide: {
          "0%":{"background-image":"url('/assets/hero/1.jpg')","transform":"scale(1.04)"},
          "33%":{"background-image":"url('/assets/hero/2.jpg')","transform":"scale(1.0)"},
          "66%":{"background-image":"url('/assets/hero/3.jpg')","transform":"scale(1.06)"},
          "100%":{"background-image":"url('/assets/hero/1.jpg')","transform":"scale(1.04)"}
        },
        floatSlow: { "0%,100%":{transform:"translateY(0)"}, "50%":{transform:"translateY(-14px)"} },
        floatReverse: { "0%,100%":{transform:"translateY(0)"}, "50%":{transform:"translateY(14px)"} },
        pulseSoft: { "0%,100%":{opacity:.25}, "50%":{opacity:.6} }
      },
      animation: {
        "hero-slideshow":"heroSlide 18s ease-in-out infinite",
        "float-slow":"floatSlow 9s ease-in-out infinite",
        "float-rev":"floatReverse 11s ease-in-out infinite",
        "pulse-soft":"pulseSoft 6s ease-in-out infinite"
      }
    }
  },
  plugins:[]
}
