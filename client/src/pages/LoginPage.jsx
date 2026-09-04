// LoginPage.jsx
import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'admin' ? '/admin' : from)
    } catch (e) { toast.error(e.response?.data?.message || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <svg viewBox="0 0 44 54" fill="none" className="h-12 w-auto">
              <path d="M22 2C14.3 2 8 8.3 8 16C8 26 22 44 22 44C22 44 36 26 36 16C36 8.3 29.7 2 22 2Z" fill="url(#pg)" />
              <circle cx="22" cy="16" r="8" fill="white" />
              <rect x="19" y="11" width="6" height="10" rx="2" fill="#1565C0" />
              <rect x="17" y="13" width="10" height="6" rx="2" fill="#1565C0" />
              <defs><linearGradient id="pg" x1="8" y1="2" x2="36" y2="44" gradientUnits="userSpaceOnUse"><stop stopColor="#1565C0" /><stop offset="1" stopColor="#1E88E5" /></linearGradient></defs>
            </svg>
            <span className="font-display font-extrabold text-2xl"><span className="text-primary">Medi</span><span className="text-success">Setu</span></span>
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-60 transition-all shadow-sm hover:shadow-md text-base mt-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Create one free</Link>
          </div>
          <div className="mt-3 text-center text-xs text-gray-400">
            Admin demo: <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded">admin@medisetu.com</span> / <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded">Admin@123</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created successfully!')
      navigate(form.role === 'hospital_admin' ? '/register-hospital' : '/')
    } catch (e) { toast.error(e.response?.data?.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <span className="font-display font-extrabold text-2xl"><span className="text-primary">Medi</span><span className="text-success">Setu</span></span>
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands finding free healthcare</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['Full Name', 'name', 'text', 'Your full name'],['Email', 'email', 'email', 'your@email.com'],['Mobile Number', 'phone', 'tel', '9876543210'],['Password', 'password', 'password', '••••••••']].map(([label, key, type, ph]) => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} required
                  placeholder={ph}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Register as</label>
              <div className="grid grid-cols-2 gap-2">
                {[['user','👤 Patient'],['hospital_admin','🏥 Hospital Admin']].map(([val, label]) => (
                  <button type="button" key={val} onClick={() => setForm(f => ({...f, role: val}))}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${form.role === val ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary/40'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-60 transition-all shadow-sm hover:shadow-md text-base">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Creating...' : 'Create Free Account'}
            </button>
          </form>
          <div className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}<Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
