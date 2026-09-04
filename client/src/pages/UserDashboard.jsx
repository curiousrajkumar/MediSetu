import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, CalendarCheck, Clock, CheckCircle2, XCircle, User } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-gray-100 text-gray-600',
}

export default function UserDashboard() {
  const { user, updateUser } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('appointments')
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', bloodGroup: user?.bloodGroup || '' })
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    api.get('/appointments/my').then(r => { setAppointments(r.data.data); setLoading(false) })
  }, [])

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    await api.put(`/appointments/${id}/cancel`, { reason: 'Cancelled by patient' })
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a))
    toast.success('Appointment cancelled')
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await api.put('/auth/profile', profileForm)
      updateUser(res.data.data)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    finally { setSavingProfile(false) }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 py-10 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">👤</div>
          <div>
            <div className="text-blue-200 text-sm font-medium">My Dashboard</div>
            <div className="font-display font-extrabold text-2xl">{user?.name}</div>
            <div className="text-blue-200 text-sm">{user?.email} · {user?.phone}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {['appointments', 'profile'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'appointments' ? '📋 My Appointments' : '👤 Profile'}
            </button>
          ))}
        </div>

        {activeTab === 'appointments' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 size={28} className="animate-spin text-primary" /></div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">No appointments yet</h3>
                <p className="text-gray-500 text-sm mb-5">Book your first appointment today</p>
                <Link to="/hospitals" className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">Find Hospitals</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(a => (
                  <div key={a._id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🏥</div>
                        <div>
                          <Link to={`/hospitals/${a.hospital?._id}`} className="font-bold text-gray-900 hover:text-primary">{a.hospital?.name}</Link>
                          <div className="text-sm text-gray-600 mt-0.5">Dr. {a.doctor?.name} · {a.doctor?.specialization}</div>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-500"><CalendarCheck size={11} />{new Date(a.appointmentDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            {a.timeSlot?.startTime && <span className="flex items-center gap-1 text-xs text-gray-500"><Clock size={11} />{a.timeSlot.startTime}</span>}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[a.status]}`}>{a.status}</span>
                          </div>
                        </div>
                      </div>
                      {['pending', 'confirmed'].includes(a.status) && (
                        <button onClick={() => cancelAppointment(a._id)}
                          className="flex items-center gap-1 text-xs font-bold text-danger border border-danger/25 px-3 py-1.5 rounded-xl hover:bg-danger/5 transition-colors flex-shrink-0">
                          <XCircle size={13} /> Cancel
                        </button>
                      )}
                    </div>
                    {a.symptoms && <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">Symptoms: {a.symptoms}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card max-w-lg">
            <h3 className="font-display font-bold text-gray-900 text-lg mb-5">Update Profile</h3>
            <form onSubmit={saveProfile} className="space-y-4">
              {[['Full Name', 'name', 'text'],['Phone Number', 'phone', 'tel']].map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type} value={profileForm[key]} onChange={e => setProfileForm(f => ({...f, [key]: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Blood Group</label>
                <select value={profileForm.bloodGroup} onChange={e => setProfileForm(f => ({...f, bloodGroup: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none bg-white">
                  <option value="">Select Blood Group</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <button type="submit" disabled={savingProfile}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-60 transition-all text-sm">
                {savingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
