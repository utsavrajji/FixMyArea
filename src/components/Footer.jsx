import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer id="contact" className="bg-[#2b2d42] pt-14 pb-10 text-white sm:pt-16 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-12 grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo & Powered by */}
          <div className="space-y-6 text-center sm:space-y-5 sm:text-left">
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                ©2025 <span className="font-semibold text-white">FixMyArea</span>
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Powered by</p>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                  <span className="text-sm font-bold text-orange-600">F</span>
                </div>
                <span className="text-sm font-semibold">FixMyArea</span>
              </div>
              <div className="space-y-1 text-xs leading-relaxed text-gray-400 sm:max-w-xs">
                <p>Ministry of Electronics & IT (MeitY)</p>
                <p>Government of India®</p>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
                <span className="text-sm">in</span>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
                <span className="text-sm">𝕏</span>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
                <span className="text-sm">📷</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#home" className="flex items-center justify-center gap-1 transition-colors hover:text-white sm:justify-start">
                  <span className="text-xs">›</span> Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="flex items-center justify-center gap-1 transition-colors hover:text-white sm:justify-start">
                  <span className="text-xs">›</span> How It Works
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center justify-center gap-1 transition-colors hover:text-white sm:justify-start">
                  <span className="text-xs">›</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="flex items-center justify-center gap-1 transition-colors hover:text-white sm:justify-start">
                  <span className="text-xs">›</span> Login
                </Link>
              </li>
              <li>
                <a href="#contact" className="flex items-center justify-center gap-1 transition-colors hover:text-white sm:justify-start">
                  <span className="text-xs">›</span> Contact Us
                </a>
              </li>
              <li>
                
              </li>
              <li>
                <a href="#terms" className="flex items-center justify-center gap-1 transition-colors hover:text-white sm:justify-start">
                  <span className="text-xs">›</span> Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          

          {/* Column 4: Get in touch */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Get in touch</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <p className="leading-relaxed">
                4th Floor, NeGD, Electronics Niketan, 6
                <br className="hidden sm:block" />
                CGO Complex, Lodhi Road, New Delhi -
                <br className="hidden sm:block" />
                110003, India
              </p>
              <p>
                <a
                  href="mailto:support-fixmyarea@digitalindia.gov.in"
                  className="break-words transition-colors hover:text-white"
                >
                  support-fixmyarea@digitalindia.gov.in
                </a>
              </p>
              <p>(011) 24307714 (9:00 AM to 5:30 PM)</p>
            </div>
          </div>
        </div>

        {/* Bottom timestamp */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Last Updated On : {new Date().toLocaleDateString("en-GB")} | v-2.2.7
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
