import { motion } from "framer-motion";

export function TestimonialsColumn({ testimonials, className = "", duration = 15 }) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <motion.div
        animate={{ y: [0, -1000] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-6"
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </motion.div>
    </div>
  );
}

function TestimonialCard({ text, image, name, role }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">
      <p className="text-gray-700 text-sm leading-relaxed mb-4">{text}</p>
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
        />
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
