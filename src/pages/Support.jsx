import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  LifeBuoy, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Phone, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportCard = ({ icon: Icon, title, description, to, linkText }) => (
  <div className="group bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200">
    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
      <Icon className="h-7 w-7 text-emerald-600" />
    </div>
    <h3 className="text-xl font-bold text-[#064E3B] mb-3">{title}</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">
      {description}
    </p>
    <Link 
      to={to} 
      className="inline-flex items-center gap-2 text-emerald-600 font-bold group-hover:gap-3 transition-all"
    >
      {linkText}
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
);

const Support = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#064E3B] py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm mb-6">
            <LifeBuoy className="h-4 w-4 text-emerald-400" />
            <span>24/7 Citizen Support</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-8">
            How can we help you?
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100/80 leading-relaxed mb-10">
            Find answers to common questions, learn how to use the platform effectively, 
            or get in touch with our support team.
          </p>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 lg:py-24 -mt-16 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SupportCard 
              icon={BookOpen}
              title="FAQs"
              description="Browse our comprehensive list of frequently asked questions for quick answers."
              to="/faqs"
              linkText="Browse FAQs"
            />
            <SupportCard 
              icon={MessageSquare}
              title="Contact Us"
              description="Need direct assistance? Send us a message and we'll get back to you within 24 hours."
              to="/contact"
              linkText="Send Message"
            />
            <SupportCard 
              icon={ShieldCheck}
              title="Privacy & Safety"
              description="Learn how we protect your data and ensure your safety on the platform."
              to="/privacy"
              linkText="Privacy Policy"
            />
          </div>
        </div>
      </section>

      {/* Direct Contact Info */}
      <section className="py-16 bg-emerald-50/50 border-y border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[#064E3B] mb-6">Get in touch directly</h2>
              <p className="text-gray-600 text-lg mb-10">
                Our team is available to assist you with any technical issues or 
                platform-related queries. We aim to respond to all inquiries as 
                quickly as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Support</p>
                    <p className="text-lg font-bold text-[#064E3B]">support@fixmyarea.gov.in</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Call Us</p>
                    <p className="text-lg font-bold text-[#064E3B]">+91 76349 23630</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Working Hours</p>
                    <p className="text-lg font-bold text-[#064E3B]">Mon–Fri · 9:00 AM to 5:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-emerald-100 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <FileText className="h-40 w-40 text-emerald-900" />
               </div>
               <h3 className="text-2xl font-bold text-[#064E3B] mb-4">Legal Information</h3>
               <p className="text-gray-600 mb-8">
                 Review our legal documents to understand your rights and our obligations.
               </p>
               <div className="space-y-4">
                 <Link to="/terms" className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-100">
                   <div className="flex items-center gap-3">
                     <FileText className="h-5 w-5 text-emerald-600" />
                     <span className="font-bold text-[#064E3B]">Terms & Conditions</span>
                   </div>
                   <ArrowRight className="h-4 w-4 text-emerald-400" />
                 </Link>
                 <Link to="/privacy" className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-100">
                   <div className="flex items-center gap-3">
                     <ShieldCheck className="h-5 w-5 text-emerald-600" />
                     <span className="font-bold text-[#064E3B]">Privacy Policy</span>
                   </div>
                   <ArrowRight className="h-4 w-4 text-emerald-400" />
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
