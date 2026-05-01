import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText, Scale, Gavel, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#064E3B] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm mb-6">
            <Scale className="h-4 w-4 text-emerald-400" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Terms & Conditions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100/80 leading-relaxed">
            Please read these terms carefully before using the FixMyArea platform. 
            By using our services, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-emerald lg:prose-lg mx-auto">
            
            <div className="flex flex-col gap-12">
              {/* Acceptance */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#064E3B] mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing or using the FixMyArea website and services, you acknowledge that you 
                  have read, understood, and agree to be bound by these Terms and Conditions. 
                  If you do not agree with any part of these terms, you must not use the platform.
                </p>
              </div>

              {/* User Responsibilities */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#064E3B] mb-4">2. User Responsibilities</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  When you report an issue on FixMyArea, you represent and warrant that:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "The information provided is true and accurate",
                    "You are reporting a genuine civic issue",
                    "The photos uploaded are taken by you",
                    "You will not use the platform for harassment",
                    "You will not post false or misleading reports",
                    "You will respect the privacy of others"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      <ChevronRight className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Gavel className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#064E3B] mb-4">3. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content, features, and functionality on FixMyArea, including but not limited to 
                  text, graphics, logos, and software, are the exclusive property of FixMyArea and 
                  are protected by international copyright, trademark, and other intellectual 
                  property laws.
                </p>
              </div>

              {/* Prohibited Activities */}
              <div className="bg-red-50 p-8 rounded-2xl border border-red-100 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <AlertCircle className="h-24 w-24 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  Prohibited Activities
                </h2>
                <p className="text-red-800/80 mb-6 font-medium">
                  Users are strictly prohibited from:
                </p>
                <ul className="grid gap-3 sm:grid-cols-2 text-red-800 text-sm">
                  <li>• Attempting to hack the platform</li>
                  <li>• Uploading malicious software</li>
                  <li>• Using automated bots for reporting</li>
                  <li>• Impersonating government officials</li>
                  <li>• Spamming the report system</li>
                  <li>• Collecting user data without consent</li>
                </ul>
              </div>

              {/* Limitation of Liability */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Scale className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#064E3B] mb-4">4. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  FixMyArea acts as a bridge between citizens and authorities. While we strive to 
                  ensure issue resolution, we do not guarantee that every reported issue will be 
                  fixed within a specific timeframe, as actual resolution depends on government 
                  agencies and available resources.
                </p>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-500">
              Last Updated: May 1, 2026
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsConditions;
