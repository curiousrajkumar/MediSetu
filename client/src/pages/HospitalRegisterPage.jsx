// HospitalRegisterPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2 } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const FormField = ({ label, name, form, setForm, type = 'text', placeholder, required, ...rest }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}{required && ' *'}</label>
    <input type={type} value={form[name]} onChange={e => setForm(f => ({...f, [name]: e.target.value}))} placeholder={placeholder} required={required}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all" {...rest} />
  </div>
)

export function HospitalRegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'government', description: '',
    'address.street': '', 'address.city': '', 'address.state': '', 'address.pincode': '',
    'contact.phone': '', 'contact.email': '', 'contact.website': '',
    specializations: '', facilities: '',
    hasFreeOPD: false, hasFreeMedicine: false, hasFreeEmergency: false,
    hasEmergency: false, hasAmbulance: false, isOpen24x7: false,
    totalBeds: '', icuBeds: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: form.name, type: form.type, description: form.description,
        address: { street: form['address.street'], city: form['address.city'], state: form['address.state'], pincode: form['address.pincode'] },
        contact: { phone: form['contact.phone'].split(',').map(p => p.trim()), email: form['contact.email'], website: form['contact.website'] },
        specializations: form.specializations.split(',').map(s => s.trim()).filter(Boolean),
        facilities: form.facilities.split(',').map(f => f.trim()).filter(Boolean),
        hasFreeOPD: form.hasFreeOPD, hasFreeMedicine: form.hasFreeMedicine, hasFreeEmergency: form.hasFreeEmergency,
        hasEmergency: form.hasEmergency, hasAmbulance: form.hasAmbulance, isOpen24x7: form.isOpen24x7,
        totalBeds: Number(form.totalBeds) || 0, icuBeds: Number(form.icuBeds) || 0,
      }
      await api.post('/hospitals/register', payload)
      setSuccess(true)
    } catch (e) { toast.error(e.response?.data?.message || 'Registration failed. Check if all required fields (*) are filled.') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-2">Submitted!</h2>
        <p className="text-gray-500 text-sm mb-6">Your hospital has been submitted for admin review. You'll be notified once approved.</p>
        <button onClick={() => navigate('/')} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">Go to Home</button>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-primary rounded-3xl p-6 text-white mb-6 text-center">
          <h1 className="font-display font-extrabold text-2xl">🏥 Register Your Hospital</h1>
          <p className="text-blue-200 text-sm mt-1">Submit your hospital for review. Go live after admin approval.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 shadow-card">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Hospital Name" name="name" form={form} setForm={setForm} placeholder="e.g. Civil Hospital Surat" required />
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none bg-white">
                {['government','private','trust','ayurvedic','clinic'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} placeholder="About the hospital..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none resize-none" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-700 mb-3">📍 Address</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Street" name="address.street" form={form} setForm={setForm} placeholder="Street address" />
              <FormField label="City" name="address.city" form={form} setForm={setForm} placeholder="City" required />
              <FormField label="State" name="address.state" form={form} setForm={setForm} placeholder="State" required />
              <FormField label="Pincode" name="address.pincode" form={form} setForm={setForm} placeholder="395001" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-700 mb-3">📞 Contact</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Phone Numbers" name="contact.phone" form={form} setForm={setForm} placeholder="0261-123456, 0261-789012" />
              <FormField label="Email" name="contact.email" form={form} setForm={setForm} type="email" placeholder="hospital@email.com" />
              <FormField label="Website" name="contact.website" form={form} setForm={setForm} placeholder="https://hospital.com" />
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Total Beds" name="totalBeds" form={form} setForm={setForm} type="number" placeholder="500" />
                <FormField label="ICU Beds" name="icuBeds" form={form} setForm={setForm} type="number" placeholder="20" />
              </div>
            </div>
          </div>
          <div>
            <FormField label="Specializations (comma-separated)" name="specializations" form={form} setForm={setForm} placeholder="Cardiology, General Medicine, Orthopedics" />
          </div>
          <div>
            <FormField label="Facilities (comma-separated)" name="facilities" form={form} setForm={setForm} placeholder="ICU, Blood Bank, MRI, Ambulance" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-700 mb-3">🏥 Services & Features</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[['hasFreeOPD','Free OPD'],['hasFreeMedicine','Free Medicine'],['hasFreeEmergency','Free Emergency'],['hasEmergency','Emergency Ward'],['hasAmbulance','Ambulance'],['isOpen24x7','Open 24/7']].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/40 transition-colors">
                  <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.checked}))}
                    className="w-4 h-4 accent-blue-600 rounded" />
                  <span className="text-sm text-gray-700 font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-60 transition-all shadow-sm hover:shadow-md text-base">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Submitting...' : 'Register Hospital'}
          </button>
        </form>
      </div>
    </main>
  )
}

// NotFoundPage.jsx
export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🏥</div>
        <h1 className="font-display font-extrabold text-5xl text-gray-900 mb-3">404</h1>
        <p className="text-xl text-gray-600 mb-2 font-semibold">Page Not Found</p>
        <p className="text-gray-400 mb-8 max-w-sm">The page you're looking for doesn't exist. Let us help you find healthcare instead.</p>
        <a href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-md">
          🏠 Back to Home
        </a>
      </div>
    </main>
  )
}

export default HospitalRegisterPage
