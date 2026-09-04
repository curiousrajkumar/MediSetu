import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Search, MapPin, CalendarCheck, Shield, Zap, Heart, Phone,
  ChevronRight, Star, Clock, ArrowRight } from 'lucide-react'
import AISymptomChecker from '../components/hospital/AISymptomChecker'

// ---------- helpers ----------
function StatCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0; const step = end / 60
    const t = setInterval(() => {
      start = Math.min(start + step, end)
      setCount(Math.floor(start))
      if (start >= end) clearInterval(t)
    }, duration / 60)
    return () => clearInterval(t)
  }, [inView, end, duration])
  return <span ref={ref}>{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}{suffix}</span>
}

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

// ---------- Section components ----------
function HeroSection() {
  const navigate = useNavigate()
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* BG decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-success/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-semibold text-primary mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
            AI-Powered Healthcare Discovery Platform
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-gray-900 mb-5">
            Find <span className="text-primary">Free &</span><br />
            Affordable <span className="text-success">Healthcare</span><br />
            <span className="text-gray-900">Near You</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
            Search symptoms, discover nearby hospitals, and access free or affordable treatment in seconds. MediSetu connects you with the right care — instantly.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
            <button onClick={() => document.getElementById('ai-search')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-md hover:shadow-xl hover:bg-primary-dark transition-all text-base">
              <Search size={18} /> Find Hospitals
            </button>
            <Link to="/emergency"
              className="flex items-center gap-2 px-7 py-3.5 bg-danger text-white font-bold rounded-2xl shadow-md hover:shadow-xl hover:bg-red-700 transition-all text-base animate-pulse-ring">
              🚑 Emergency Help
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {['AI Symptom Checker', 'Nearby Hospitals', 'Free Treatment', 'Book Appointment', 'Govt. Schemes'].map(f => (
              <span key={f} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">
                <span className="text-success font-bold">✓</span>{f}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: mini hospital map card */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="hidden lg:flex items-center justify-center relative">
          {/* Float cards */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 right-10 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-10 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
              <span className="font-bold text-success">Free Treatment Available</span>
            </div>
            <div className="text-gray-400 mt-0.5">3 hospitals nearby</div>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-10 text-xs">
            <div className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /><span className="font-bold">4.8</span></div>
            <div className="text-gray-400">AIIMS · 1.2 km</div>
          </motion.div>

          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-card-hover border border-gray-100 p-5 w-full max-w-sm">
            {/* Mini map */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl h-44 flex items-center justify-center relative overflow-hidden mb-4 border border-primary/10">
              <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1565C0" strokeWidth="0.5" />
                </pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              {/* "roads" */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 176">
                <path d="M0 88 Q150 78 300 88" stroke="white" strokeWidth="5" fill="none" opacity="0.8" />
                <path d="M120 0 L115 176" stroke="white" strokeWidth="4" fill="none" opacity="0.7" />
                <path d="M220 0 L216 176" stroke="white" strokeWidth="3" fill="none" opacity="0.5" />
              </svg>
              {/* Pins */}
              {[{x:'30%',y:'25%',c:'#1565C0'},{x:'58%',y:'42%',c:'#2E7D32'},{x:'76%',y:'20%',c:'#00796B'}].map((p, i) => (
                <div key={i} className="absolute flex flex-col items-center" style={{ left: p.x, top: p.y }}>
                  <div className="w-6 h-6 rounded-full rounded-bl-none flex items-center justify-center shadow-md -rotate-45" style={{ background: p.c }}>
                    <span className="text-white text-[8px] font-bold rotate-45">+</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full mt-0.5 opacity-40" style={{ background: p.c }} />
                </div>
              ))}
              <div className="absolute bottom-4 left-4 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow-md animate-pulse-ring" />
              <div className="absolute top-2 left-2 bg-white/90 rounded-lg px-2 py-0.5 text-[10px] font-bold text-primary shadow-sm">📍 Your Location</div>
            </div>

            {/* Mini hospital list */}
            {[
              { n: 'New Civil Hospital', d: '1.2 km', free: true, type: '🏥' },
              { n: 'SMIMER Medical College', d: '2.8 km', free: true, type: '🏨' },
              { n: 'Kiran Multi-Speciality', d: '3.4 km', free: false, type: '🏦' },
            ].map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">{h.type}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-800 truncate">{h.n}</div>
                  <div className="text-[10px] text-gray-400">📍 {h.d}</div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${h.free ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {h.free ? 'FREE' : 'PAID'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { end: 2400, suffix: '+', label: 'Hospitals Listed', icon: '🏥' },
    { end: 890, suffix: '+', label: 'Free Treatment Options', icon: '💚' },
    { end: 150, suffix: 'K+', label: 'Patients Helped', icon: '👥' },
    { end: 48, suffix: '', label: 'Govt. Schemes', icon: '📋' },
  ]
  return (
    <section className="bg-white py-14 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="font-display font-extrabold text-3xl gradient-text">
                <StatCounter end={s.end} suffix={s.suffix} />
              </div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: '🩺', title: 'Enter Symptoms', desc: 'Type your symptoms or disease name. Our AI analyzes and suggests possible conditions instantly.' },
    { icon: '📍', title: 'Discover Hospitals', desc: 'We detect your location and show nearby hospitals offering free or paid treatment.' },
    { icon: '📋', title: 'Book Appointment', desc: 'Choose your doctor, select a time slot, and confirm your appointment online — in seconds.' },
    { icon: '💳', title: 'Use Govt. Schemes', desc: 'Avail Ayushman Bharat and state schemes for free or subsidized treatment.' },
  ]
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Simple Process</div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 mb-3">How MediSetu Works</h2>
          <p className="text-gray-500 max-w-md mx-auto">Find free and affordable healthcare in 3 easy steps</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-blue-100 shadow-card relative overflow-hidden hover-lift">
              <div className="absolute top-4 right-4 text-6xl font-black text-primary/4 font-display leading-none">{i + 1}</div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl mb-4">{s.icon}</div>
              <h3 className="font-display font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EmergencyBanner() {
  return (
    <section className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-14 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute text-white text-5xl font-black"
            style={{ top: `${10 + i * 15}%`, left: `${(i * 13) % 95}%`, opacity: 0.15 }}>🚑</div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-bold text-white mb-4 border border-white/25">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse-dot" /> Emergency Mode Available 24/7
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-snug">
              🚨 Medical Emergency?<br />Get Help Instantly
            </h2>
            <p className="text-red-100 text-base leading-relaxed mb-6 max-w-md">
              One tap to find the nearest emergency hospitals, ambulance services, and helplines in your area.
            </p>
            <Link to="/emergency"
              className="inline-flex items-center gap-2.5 bg-white text-danger font-extrabold px-8 py-3.5 rounded-2xl text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
              🚑 Activate Emergency Mode <ArrowRight size={18} />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { icon: '🏥', title: 'Nearest Emergency Ward', sub: 'New Civil Hospital · 1.2 km · Open 24/7' },
              { icon: '🚑', title: 'Ambulance Services', sub: '108 (Free) · 102 (Maternity) · 1066 (Blood)' },
              { icon: '📞', title: 'Emergency Helplines', sub: 'Health Helpline: 104 · NDMA: 1078' },
            ].map((c) => (
              <div key={c.title} className="flex items-center gap-4 bg-white/12 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">{c.icon}</div>
                <div>
                  <div className="font-bold text-white text-sm">{c.title}</div>
                  <div className="text-xs text-red-100 mt-0.5">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GovernmentSchemes() {
  const schemes = [
    { icon: '🌾', name: 'Ayushman Bharat (PMJAY)', desc: '₹5 lakh health coverage per family', color: 'from-green-50 to-emerald-50', border: 'border-green-200' },
    { icon: '🏛️', name: 'MA Vatsalya (Gujarat)', desc: 'Free OPD, medicines & emergency care', color: 'from-blue-50 to-sky-50', border: 'border-blue-200' },
    { icon: '👶', name: 'Janani Suraksha Yojana', desc: 'Safe motherhood & delivery support', color: 'from-pink-50 to-rose-50', border: 'border-pink-200' },
    { icon: '💊', name: 'PM Jan Aushadhi', desc: 'Generic medicines 50–90% cheaper', color: 'from-amber-50 to-yellow-50', border: 'border-amber-200' },
  ]
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-success uppercase tracking-widest mb-2">Government Support</div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 mb-3">Healthcare Schemes We Support</h2>
          <p className="text-gray-500 max-w-md mx-auto">Access free and subsidized treatment through government healthcare programs</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {schemes.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 border ${s.border} hover-lift`}>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-display font-bold text-gray-900 text-sm mb-1.5">{s.name}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              <Link to="/schemes" className="inline-flex items-center gap-1 text-xs font-bold text-primary mt-3 hover:gap-2 transition-all">
                Learn more <ChevronRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/schemes" className="inline-flex items-center gap-2 bg-success text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm">
            View All Government Schemes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ---------- Main Page ----------
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />

      {/* AI Symptom Checker Section */}
      <section id="ai-search" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">🤖 AI-Powered</div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 mb-3">Smart Disease & Hospital Finder</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Enter your symptoms or disease name. Our AI will suggest possible conditions and show you nearby hospitals.
            </p>
          </div>
          <AISymptomChecker />
          <div className="text-center mt-6">
            <Link to="/hospitals" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm">
              Or browse all hospitals <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
      <EmergencyBanner />
      <GovernmentSchemes />
    </main>
  )
}
