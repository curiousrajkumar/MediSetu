import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 44 54" fill="none" className="h-10 w-auto">
                <path d="M22 2C14.3 2 8 8.3 8 16C8 26 22 44 22 44C22 44 36 26 36 16C36 8.3 29.7 2 22 2Z" fill="#1E88E5" />
                <circle cx="22" cy="16" r="8" fill="white" />
                <rect x="19" y="11" width="6" height="10" rx="2" fill="#1565C0" />
                <rect x="17" y="13" width="10" height="6" rx="2" fill="#1565C0" />
              </svg>
              <div>
                <div className="font-display font-bold text-lg leading-none">
                  <span className="text-blue-400">Medi</span>
                  <span className="text-green-400">Setu</span>
                </div>
                <div className="text-[9px] text-gray-500 mt-0.5">Find Free & Affordable Healthcare</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              India's AI-powered healthcare discovery platform. Find free and affordable hospitals near you — instantly.
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2"><Phone size={13} /><span>Emergency: 108</span></div>
              <div className="flex items-center gap-2"><Mail size={13} /><span>help@medisetu.com</span></div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'],['hospitals', 'Find Hospitals'],['hospitals?free=true', 'Free Treatment'],['emergency', 'Emergency Help'],['blood-bank', 'Blood Bank']].map(([to, label]) => (
                <li key={to}><Link to={`/${to}`} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Healthcare</h4>
            <ul className="space-y-2 text-sm">
              {[['schemes', 'Govt. Schemes'],['hospitals?type=ayurvedic', 'Ayurvedic Hospitals'],['hospitals?hasEmergency=true', 'Emergency Hospitals'],['register-hospital', 'Register Hospital']].map(([to, label]) => (
                <li key={to}><Link to={`/${to}`} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Emergency Numbers</h4>
            <div className="space-y-2 text-sm">
              {[['108','Ambulance (Free)','bg-red-900/40'],['104','Health Helpline','bg-blue-900/30'],['1066','Blood Emergency','bg-red-900/30'],['102','Maternity','bg-pink-900/30'],['100','Police','bg-gray-800']].map(([num, label, bg]) => (
                <a key={num} href={`tel:${num}`}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 ${bg} hover:opacity-80 transition-opacity`}>
                  <span className="text-gray-300">{label}</span>
                  <span className="font-display font-bold text-white">{num}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            © 2025 MediSetu. Made with <Heart size={11} className="text-red-500 fill-red-500" /> for India
          </span>
          <div className="flex gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Medical Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
