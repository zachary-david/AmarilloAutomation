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
              Helping Texas Panhandle businesses navigate AI and automation solutions with expert workflow automation, tech integration, and custom development services.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/solutions" className="hover:text-white transition-colors">Automation Solutions</Link></li>
              <li><Link href="/market-survey" className="hover:text-white transition-colors">Market Survey</Link></li>
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
              <li><Link href="/market-survey" className="hover:text-white transition-colors">Market Survey</Link></li>
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

            {/* Social Links / Additional Info */}
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <span>Amarillo, Texas</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}