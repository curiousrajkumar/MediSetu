import React, { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle, Users, Building2, CalendarCheck, Clock } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState([])
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/hospitals/pending'),
      api.get('/admin/users'),
      api.get('/admin/appointments')
    ]).then(([s, p, u, a]) => {
      setStats(s.data.data); setPending(p.data.data); setUsers(u.data.data); setAppointments(a.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const approveHospital = async (id, status) => {
    await api.put(`/admin/hospitals/${id}/status`, { status, adminNotes: status === 'approved' ? 'Approved by admin' : 'Rejected by admin' })
    setPending(prev => prev.filter(h => h._id !== id))
    toast.success(`Hospital ${status}`)
  }

  const toggleUser = async (id) => {
    const res = await api.put(`/admin/users/${id}/toggle-status`)
    setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.data.data.isActive } : u))
    toast.success(res.data.message)
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 size={32} className="animate-spin text-primary" /></div>

  const statCards = [
    { label: 'Approved Hospitals', value: stats?.totalHospitals || 0, icon: Building2, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Approvals', value: stats?.pendingHospitals || 0, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: CalendarCheck, color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-10 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-gray-400 text-sm font-medium mb-1">MediSetu</div>
          <h1 className="font-display font-extrabold text-3xl">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}>
                <s.icon size={20} />
              </div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{s.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto w-fit">
          {['pending', 'users', 'appointments'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize whitespace-nowrap transition-all ${activeTab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'pending' ? `⏳ Pending (${pending.length})` : t === 'users' ? `👥 Users` : `📋 Appointments`}
            </button>
          ))}
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pending.length === 0 ? <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-200">No pending hospitals 🎉</div> :
              pending.map(h => (
                <div key={h._id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-display font-bold text-gray-900">{h.name}</h3>
                      <p className="text-sm text-gray-500">{h.address?.city}, {h.address?.state} · {h.type}</p>
                      <p className="text-xs text-gray-400 mt-1">Registered by: {h.registeredBy?.name} ({h.registeredBy?.email})</p>
                      <p className="text-xs text-gray-400">Submitted: {new Date(h.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveHospital(h._id, 'approved')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-success text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors">
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button onClick={() => approveHospital(h._id, 'rejected')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-danger text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors">
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  {['Name','Email','Phone','Role','Status','Action'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">{h}</th>)}
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500">{u.phone}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'hospital_admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                      <td className="px-4 py-3">
                        {u.role !== 'admin' && <button onClick={() => toggleUser(u._id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${u.isActive ? 'border-red-200 text-danger hover:bg-red-50' : 'border-green-200 text-success hover:bg-green-50'}`}>
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  {['Patient','Hospital','Doctor','Date','Status','Fee'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">{h}</th>)}
                </tr></thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3"><div className="font-semibold text-gray-800">{a.patient?.name}</div><div className="text-xs text-gray-400">{a.patient?.phone}</div></td>
                      <td className="px-4 py-3 text-gray-700">{a.hospital?.name}</td>
                      <td className="px-4 py-3 text-gray-700">{a.doctor?.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(a.appointmentDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                        a.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        a.status === 'completed' ? 'bg-green-100 text-green-700' :
                        a.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.status}</span></td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{a.isFree ? <span className="text-success">FREE</span> : `₹${a.fee}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
