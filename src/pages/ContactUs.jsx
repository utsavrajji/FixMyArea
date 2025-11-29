import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import Footer from "../components/Footer";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Back Button - Fixed Position */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-500 text-gray-700 hover:text-orange-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">{currentUser ? "Back to Dashboard" : "Back to Home"}</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 px-4 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold mb-4">
              📞 We're Here to Help
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch with Us
            </h1>
            <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto">
              Have questions, feedback, or need assistance? We'd love to hear from you. Our team is ready to help!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {/* Email Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                  📧
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Email Us</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Send us an email anytime, we'll respond within 24 hours
                </p>
                <a
                  href="mailto:support@fixmyarea.com"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  support@fixmyarea.com
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                  📱
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Call Us</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Mon-Fri from 9am to 6pm IST
                </p>
                <a
                  href="tel:+911234567890"
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors inline-flex items-center gap-2"
                >
                  +91 123-456-7890
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                  📍
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Visit Us</h3>
                <p className="text-sm text-gray-600 mb-3">
                  FixMyArea Office, Radhe Nagar, Ranchi, Jharkhand - 834001, India
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold hover:text-purple-700 transition-colors inline-flex items-center gap-2"
                >
                  View on Map
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Social Media Card */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Follow Us</h3>
                <p className="text-sm text-orange-100 mb-4">
                  Stay updated with our latest news and updates
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://twitter.com/fixmyarea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl">🐦</span>
                  </a>
                  <a
                    href="https://facebook.com/fixmyarea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl">📘</span>
                  </a>
                  <a
                    href="https://instagram.com/fixmyarea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl">📷</span>
                  </a>
                  <a
                    href="https://linkedin.com/company/fixmyarea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl">💼</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Send Us a Message</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible</p>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-start gap-3 animate-fade-in">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold">Message Sent Successfully!</p>
                      <p className="text-sm">Thank you for contacting us. We'll respond within 24 hours. Redirecting to home...</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3 animate-shake">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                    <button onClick={() => setError("")} className="ml-auto text-red-700 hover:text-red-900">✕</button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91-XXXXX-XXXXX"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
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

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message here..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 resize-none"
                      required
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {formData.message.length}/1000 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : success ? (
                      <>
                        <span>✅</span>
                        <span>Message Sent!</span>
                      </>
                    ) : (
                      <>
                        <span>📤</span>
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">❓</span>
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-1">How long does it take to get a response?</h4>
                    <p className="text-sm text-gray-600">We typically respond within 24 hours on business days.</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-1">Can I report issues through contact form?</h4>
                    <p className="text-sm text-gray-600">No, please use the "Report Issue" feature for civic issues. This form is for general inquiries only.</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-1">Do you offer technical support?</h4>
                    <p className="text-sm text-gray-600">Yes! Select "Technical Support" as your subject and describe your issue in detail.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      <Footer />
    </>
  );
}
