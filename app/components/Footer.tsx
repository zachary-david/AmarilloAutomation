import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-20 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          
          {/* Company Name */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">Amarillo Automation</h3>
          </div>
          
          {/* Legal Links */}
          <div className="flex items-center space-x-6 text-gray-400 text-sm">
            <Link 
              href="/privacy-policy" 
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link 
              href="/terms-of-service" 
              className="hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-gray-400 text-sm text-center">
            © 2025 Amarillo Automation LLC. All rights reserved.
          </div>
          
        </div>
      </div>
    </footer>
  )
}