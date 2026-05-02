import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Phone, Mail, Smartphone, MapPin, CircleCheck, AlertTriangle, X, Send, HelpCircle, ArrowRight } from "lucide-react";

export default function ContactUs() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Save contact message to Firestore
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "New"
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("Failed to submit your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-[#064E3B] text-white py-20 px-4 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/4 h-96 w-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute left-0 bottom-0 translate-y-1/4 -translate-x-1/4 h-64 w-64 bg-emerald-300/5 rounded-full blur-2xl" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>We're Here to Help</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Get in Touch <span className="text-emerald-400">with Us</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or need assistance? We'd love to hear from you. 
              Our team is dedicated to building a better community together.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-16 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 p-8 hover:shadow-2xl transition-all duration-500 group">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#064E3B] mb-2">Email Us</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Our support team is available to answer your questions via email.
                </p>
                <a
                  href="mailto:fixmyareas@gmail.com"
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group/link"
                >
                  fixmyareas@gmail.com
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 p-8 hover:shadow-2xl transition-all duration-500 group">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#064E3B] mb-2">Call Us</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Reach out for immediate assistance during working hours.
                </p>
                <a
                  href="tel:+917634923630"
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group/link"
                >
                  +91 76349 23630
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="bg-[#064E3B] rounded-[2rem] shadow-xl shadow-emerald-900/10 p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
                  <MapPin className="w-40 h-40" />
                </div>
                <h3 className="text-xl font-bold mb-4">Visit Us</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed mb-6">
                  4th Floor, NeGD, Electronics Niketan,<br />
                  6 CGO Complex, Lodhi Road,<br />
                  New Delhi – 110003, India
                </p>
                <button className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/10 backdrop-blur-sm">
                  Get Directions
                </button>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 p-8 md:p-12 h-full">
                <div className="mb-10">
                  <h2 className="text-3xl font-extrabold text-[#064E3B] mb-3">Send Us a Message</h2>
                  <p className="text-gray-500">
                    Tell us what's on your mind. We'll get back to you as soon as possible.
                  </p>
                </div>

                {success && (
                  <div className="mb-8 bg-emerald-50 border border-emerald-100 text-emerald-800 px-6 py-4 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <CircleCheck className="w-6 h-6 shrink-0 text-emerald-500" />
                    <div>
                      <p className="font-bold">Thank you for reaching out!</p>
                      <p className="text-sm opacity-90">Your message has been received. Redirecting you home...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-8 bg-red-50 border border-red-100 text-red-800 px-6 py-4 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <AlertTriangle className="w-6 h-6 shrink-0 text-red-500" />
                    <div>
                      <p className="font-bold">Something went wrong</p>
                      <p className="text-sm opacity-90">{error}</p>
                    </div>
                    <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#064E3B] ml-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#064E3B] ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#064E3B] ml-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 00000 00000"
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#064E3B] ml-1">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none appearance-none"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Report a Bug">Report a Bug</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Partnership">Partnership Opportunity</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#064E3B] ml-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you today?"
                      rows={5}
                      className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-[#064E3B] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/10 hover:bg-[#053d2f] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
