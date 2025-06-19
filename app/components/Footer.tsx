// app/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-20 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Amarillo Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Industrial automation and infrastructure solutions with cutting-edge technology and 24/7 support.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/solutions" className="hover:text-white transition-colors">Automation Solutions</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">Try Our Demo</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">24/7 Support</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Emergency Support</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/solutions" className="hover:text-white transition-colors">Our Solutions</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="mailto:admin@amarilloautomation.com" className="hover:text-white transition-colors">
                  admin@amarilloautomation.com
                </a>
              </li>
              <li>
                <a href="mailto:247@amarilloautomation.com" className="hover:text-white transition-colors">
                  247@amarilloautomation.com
                </a>
              </li>
              <li className="pt-2">
                <span className="text-gray-500">Office Hours:</span><br />
                Mon-Fri: 8:00 AM - 5:00 PM CST<br />
                Sat: 10:00 AM - 4:00 PM CST
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2025 Amarillo Automation LLC. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <div className="flex gap-4 text-xs">
                <a 
                  href="https://www.termsfeed.com/live/3998d381-cd06-478a-b747-26d6355714dd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  title="Privacy Policy Source"
                >
                  Privacy Source
                </a>
                <a 
                  href="https://www.termsfeed.com/live/4558541e-03b6-4367-865e-f2145cade90b" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  title="Terms & Conditions Source"
                >
                  Terms Source
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </footer>
  )
}