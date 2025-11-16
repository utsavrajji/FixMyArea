import { TestimonialsColumn } from "./TestimonialsColumn";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "FixMyArea transformed how our community reports issues. The transparent tracking system keeps everyone informed, and we've seen faster resolutions than ever before!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Sharma",
    role: "Community Leader, Mumbai",
  },
  {
    text: "Finally, a platform that holds authorities accountable! I reported a broken streetlight and it was fixed within 3 days. The issue tracking feature is brilliant.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Rajesh Kumar",
    role: "Citizen, Delhi",
  },
  {
    text: "The support from the FixMyArea team has been exceptional. They helped us set up for our entire ward, making civic engagement much easier for residents.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Anjali Desai",
    role: "Ward Representative",
  },
  {
    text: "FixMyArea's photo upload and location tracking made reporting drainage issues so simple. The community voting system helped prioritize urgent problems effectively.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    name: "Arjun Patel",
    role: "Resident, Bangalore",
  },
  {
    text: "This platform bridges the gap between citizens and government. I can track all my reported issues in one place and see real progress. Highly recommend!",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    name: "Sneha Reddy",
    role: "Social Activist",
  },
  {
    text: "Our local issues went from being ignored to resolved in weeks. FixMyArea's transparency and community support features create real accountability.",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    name: "Kavita Singh",
    role: "Homemaker, Pune",
  },
  {
    text: "The user-friendly interface made it easy for even elderly residents to report problems. FixMyArea is empowering our entire community to take action.",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    name: "Manish Gupta",
    role: "IT Professional, Hyderabad",
  },
  {
    text: "FixMyArea helped us organize and prioritize over 50 pending civic issues in our society. The admin dashboard is incredibly useful for tracking progress.",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    name: "Deepa Mehta",
    role: "Society Secretary",
  },
  {
    text: "I love how FixMyArea brings the community together. Seeing neighbors support each other's issues creates real change. The platform is intuitive and effective.",
    image: "https://randomuser.me/api/portraits/men/72.jpg",
    name: "Vikram Nair",
    role: "Student, Chennai",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-b from-white via-blue-50/30 to-white py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 py-2 px-4 rounded-full mb-4">
            <span className="text-2xl">💬</span>
            <span className="text-sm font-semibold text-blue-700">Testimonials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-gray-900">
            What our users say
          </h2>
          <p className="text-center mt-4 text-gray-600 text-lg">
            Real stories from citizens making their communities better with FixMyArea.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[700px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:flex" duration={25} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:flex" duration={22} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
