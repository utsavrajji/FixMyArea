import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer id="contact" className="bg-[#2b2d42] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & Powered by */}
          <div>
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-3">©2025 <span className="font-semibold text-white">FixMyArea</span></p>
              <p className="text-gray-400 text-xs mb-4">Powered by</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">F</span>
                </div>
                <span className="text-sm font-semibold">FixMyArea</span>
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                <p>Ministry of Electronics & IT (MeitY)</p>
                <p>Government of India®</p>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <span className="text-sm">in</span>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <span className="text-sm">𝕏</span>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <span className="text-sm">📷</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> How It Works
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> Login
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> Contact Us
                </a>
              </li>
              <li>
                <a href="#accessibility" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> Accessibility Statement
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> Disclaimer
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <span className="text-xs">›</span> Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links (Partner logos placeholder) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded p-2 flex items-center justify-center h-16">
                <span className="text-xs text-gray-600 font-semibold">Digital India</span>
              </div>
              <div className="bg-white rounded p-2 flex items-center justify-center h-16">
                <span className="text-xs text-gray-600 font-semibold">MyGov</span>
              </div>
              <div className="bg-white rounded p-2 flex items-center justify-center h-16">
                <span className="text-xs text-gray-600 font-semibold">India.gov.in</span>
              </div>
              <div className="bg-white rounded p-2 flex items-center justify-center h-16">
                <span className="text-xs text-gray-600 font-semibold">Data.gov.in</span>
              </div>
              <div className="bg-white rounded p-2 flex items-center justify-center h-16 col-span-2">
                <span className="text-xs text-gray-600 font-semibold">UMANG</span>
              </div>
            </div>
          </div>

          {/* Column 4: Get in touch */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in touch</h3>
            <div className="text-sm text-gray-300 space-y-3">
              <p className="leading-relaxed">
                4th Floor, NeGD, Electronics Niketan, 6<br />
                CGO Complex, Lodhi Road, New Delhi -<br />
                110003, India
              </p>
              <p>
                <a href="mailto:support-fixmyarea@digitalindia.gov.in" className="hover:text-white transition-colors break-all">
                  support-fixmyarea@digitalindia.gov.in
                </a>
              </p>
              <p>(011) 24307714 (9:00 AM to 5:30 PM)</p>
            </div>
          </div>
        </div>

        {/* Bottom timestamp */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500 text-xs">
            Last Updated On : {new Date().toLocaleDateString('en-GB')} | v-2.2.7
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
