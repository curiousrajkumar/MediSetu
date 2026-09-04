// AppointmentPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Loader2, CalendarCheck, CheckCircle2 } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AppointmentPage() {
  const { hospitalId, doctorId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [hospital, setHospital] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [form, setForm] = useState({
    doctorId: doctorId !== 'select' ? doctorId : '',
    appointmentDate: '',
    timeSlot: { startTime: '', endTime: '' },
    symptoms: '',
    appointmentType: 'OPD',
  })

  const TIME_SLOTS = [
    { label: '9:00 AM – 9:30 AM', start: '09:00', end: '09:30' },
    { label: '10:00 AM – 10:30 AM', start: '10:00', end: '10:30' },
    { label: '11:30 AM – 12:00 PM', start: '11:30', end: '12:00' },
    { label: '2:00 PM – 2:30 PM', start: '14:00', end: '14:30' },
    { label: '4:00 PM – 4:30 PM', start: '16:00', end: '16:30' },
  ]

  useEffect(() => {
    const fetch = async () => {
      try {
        const [hRes, dRes] = await Promise.all([
          api.get(`/hospitals/${hospitalId}`),
          api.get(`/doctors/hospital/${hospitalId}`)
        ])
        setHospital(hRes.data.data)
        setDoctors(dRes.data.data)
      } catch { navigate('/hospitals') }
      finally { setLoading(false) }
    }
    fetch()
  }, [hospitalId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.doctorId || !form.appointmentDate || !form.timeSlot.startTime) {
      toast.error('Please fill all required fields'); return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/appointments', { ...form, hospitalId })
      setSuccess(res.data.data)
      toast.success('Appointment booked successfully!')
    } catch (e) { toast.error(e.response?.data?.message || 'Booking failed') }
    finally { setSubmitting(false) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 size={32} className="animate-spin text-primary" /></div>

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-2">Appointment Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-6">Your appointment has been booked. You'll receive a confirmation SMS shortly.</p>
        <div className="bg-green-50 rounded-2xl p-4 text-left text-sm mb-6 border border-green-200">
          <div className="space-y-1.5">
            <div><span className="text-gray-500">Hospital:</span> <span className="font-semibold">{hospital?.name}</span></div>
            <div><span className="text-gray-500">Doctor:</span> <span className="font-semibold">{success.doctor?.name}</span></div>
            <div><span className="text-gray-500">Date:</span> <span className="font-semibold">{new Date(success.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div><span className="text-gray-500">Time:</span> <span className="font-semibold">{success.timeSlot?.startTime} – {success.timeSlot?.endTime}</span></div>
            <div><span className="text-gray-500">Type:</span> <span className="font-semibold">{success.appointmentType}</span></div>
            <div><span className="text-gray-500">Fee:</span> <span className={`font-bold ${success.isFree ? 'text-success' : 'text-primary'}`}>{success.isFree ? 'FREE' : `₹${success.fee}`}</span></div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard" className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-sm text-center hover:bg-primary-dark transition-colors">View My Appointments</Link>
          <Link to="/hospitals" className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm text-center hover:border-primary/40 transition-colors">Browse Hospitals</Link>
        </div>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-primary rounded-3xl p-6 text-white mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">Booking Appointment</div>
          <div className="font-display font-extrabold text-xl">{hospital?.name}</div>
          <div className="text-blue-200 text-sm mt-1">{hospital?.address?.city}, {hospital?.address?.state}</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-6 space-y-5 shadow-card">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Select Doctor *</label>
            <select value={form.doctorId} onChange={e => setForm(f => ({...f, doctorId: e.target.value}))} required
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary/50 outline-none bg-white">
              <option value="">Choose a Doctor</option>
              {doctors.map(d => <option key={d._id} value={d._id}>{d.name} – {d.specialization} ({d.isFreeConsultation ? 'FREE' : `₹${d.consultationFee}`})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Appointment Date *</label>
            <input type="date" value={form.appointmentDate} onChange={e => setForm(f => ({...f, appointmentDate: e.target.value}))} required
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Time Slot *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map(s => (
                <button type="button" key={s.label}
                  onClick={() => setForm(f => ({...f, timeSlot: { startTime: s.start, endTime: s.end }}))}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${form.timeSlot.startTime === s.start ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/40'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Appointment Type</label>
            <div className="flex gap-2">
              {['OPD', 'Emergency', 'Teleconsult'].map(t => (
                <button type="button" key={t}
                  onClick={() => setForm(f => ({...f, appointmentType: t}))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${form.appointmentType === t ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary/40'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Symptoms (Optional)</label>
            <textarea value={form.symptoms} onChange={e => setForm(f => ({...f, symptoms: e.target.value}))}
              placeholder="Describe your symptoms or reason for visit..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary/50 outline-none resize-none" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-60 transition-all shadow-sm hover:shadow-md text-base">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <CalendarCheck size={18} />}
            {submitting ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </main>
  )
}
