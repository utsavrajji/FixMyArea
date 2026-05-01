import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#064E3B] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm mb-6">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Privacy Matters</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100/80 leading-relaxed">
            At FixMyArea, your privacy is our priority. We are committed to protecting your personal data 
            and being transparent about how we use it.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-emerald lg:prose-lg mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#064E3B] mb-6 flex items-center gap-3">
                <FileText className="h-8 w-8 text-emerald-600" />
                Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Welcome to FixMyArea. We respect your privacy and want to protect your personal information. 
                This Privacy Policy explains how we collect, use, and (under certain conditions) disclose 
                your personal information.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By visiting the Site directly or through another site, you accept the practices described 
                in this Policy. Data protection is a matter of trust and your privacy is important to us. 
                We shall therefore only use your name and other information which relates to you in the 
                manner set out in this Privacy Policy.
              </p>
            </div>

            <div className="grid gap-12 sm:grid-cols-2 mb-16">
              <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
                <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                  <Eye className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-[#064E3B] mb-4">What We Collect</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Personal identity information (Name, Email)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Location data for reporting issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Photos uploaded for issue reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Usage data and device information</span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
                <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                  <Lock className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-[#064E3B] mb-4">How We Protect It</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>End-to-end encryption for data transfer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Secure cloud storage for reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Regular security audits and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Strict access controls for admin data</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-[#064E3B] mb-4">How We Use Your Data</h2>
                <p className="text-gray-600 leading-relaxed">
                  The information we collect is primarily used to provide and improve our services. 
                  This includes processing your reports, communicating with local authorities, 
                  sending you updates about the status of reported issues, and improving the 
                  overall user experience of the platform.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#064E3B] mb-4">Sharing Your Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  We do not sell your personal data to third parties. We only share information with 
                  relevant government authorities and municipal bodies strictly for the purpose of 
                  resolving the civic issues you report. Your contact details are kept confidential 
                  unless explicitly required for the resolution process.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <h2 className="text-2xl font-bold text-[#064E3B] mb-4">Contact Us About Privacy</h2>
                <p className="text-gray-600 mb-6">
                  If you have any questions or concerns about this Privacy Policy or our data 
                  handling practices, please feel free to reach out to our privacy officer.
                </p>
                <a 
                  href="mailto:privacy@fixmyarea.gov.in" 
                  className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-800 transition-colors"
                >
                  privacy@fixmyarea.gov.in
                  <ChevronRight className="h-4 w-4" />
                </a>
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

export default PrivacyPolicy;
