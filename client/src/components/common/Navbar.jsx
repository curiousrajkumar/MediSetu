import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  Menu, X, ChevronDown, User, LogOut,
  LayoutDashboard, Shield, Heart, Phone
} from 'lucide-react'

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 flex-shrink-0">
    <svg viewBox="0 0 44 54" fill="none" className="h-10 w-auto">
      <path d="M22 2C14.3 2 8 8.3 8 16C8 26 22 44 22 44C22 44 36 26 36 16C36 8.3 29.7 2 22 2Z"
        fill="url(#pg)" />
      <circle cx="22" cy="16" r="8" fill="white" />
      <rect x="19" y="11" width="6" height="10" rx="2" fill="#1565C0" />
      <rect x="17" y="13" width="10" height="6" rx="2" fill="#1565C0" />
      <defs>
        <linearGradient id="pg" x1="8" y1="2" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1565C0" />
          <stop offset="1" stopColor="#1E88E5" />
        </linearGradient>
      </defs>
    </svg>
    <div>
      <div className="font-display font-bold text-lg leading-none">
        <span className="text-primary">Medi</span>
        <span className="text-success">Setu</span>
      </div>
      <div className="text-[9px] text-gray-400 leading-none mt-0.5 hidden sm:block">
        Find Free &amp; Affordable Healthcare
      </div>
    </div>
  </Link>
)

const navLinks = [
  { to: '/hospitals', label: 'Find Hospitals' },
  { to: '/schemes', label: 'Govt. Schemes' },
  { to: '/blood-bank', label: 'Blood Bank' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [lang, setLang] = useState('EN')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/'); setUserMenuOpen(false) }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-sm'} border-b border-primary/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith(l.to) ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-primary hover:bg-primary/5'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/emergency"
            className="px-3 py-2 rounded-lg text-sm font-bold text-danger flex items-center gap-1.5 hover:bg-danger/5 transition-colors">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse-dot inline-block" />
            Emergency
          </Link>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white cursor-pointer focus:outline-none focus:border-primary/40">
            <option value="EN">🌐 EN</option>
            <option value="HI">हि HI</option>
            <option value="GU">ગુ GU</option>
            <option value="UR">اردو UR</option>
          </select>

          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(p => !p)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email}</div>
                    </div>
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                      <LayoutDashboard size={15} /> My Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger/5 transition-colors w-full text-left">
                      <LogOut size={15} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-primary border border-primary/25 rounded-lg hover:bg-primary/5 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark shadow-sm hover:shadow-md transition-all">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMenuOpen(p => !p)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary">
                  {l.label}
                </Link>
              ))}
              <Link to="/emergency" className="block px-3 py-2.5 rounded-lg text-sm font-bold text-danger hover:bg-danger/5">🚨 Emergency</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary/5">My Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/5">Logout</button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-semibold text-primary border border-primary/25 rounded-lg">Login</Link>
                  <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-white rounded-lg">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
