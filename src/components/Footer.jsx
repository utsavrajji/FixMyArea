import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer id="contact" className="bg-govText text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-govBlue font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold">FixMyArea</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering citizens to report local issues and work together with government for a better community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-govBlue rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                <span>📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-govBlue rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                <span>🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-govBlue rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                <span>📧</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>fixmyarea.gov.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 FixMyArea. All rights reserved. | Govt of India Initiative
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
