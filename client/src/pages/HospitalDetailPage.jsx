import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, Globe, Clock, Star, CheckCircle2, Loader2, ArrowLeft, CalendarCheck, AlertTriangle } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function HospitalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [hospital, setHospital] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [hRes, rRes] = await Promise.all([
          api.get(`/hospitals/${id}`),
          api.get(`/reviews/hospital/${id}`)
        ])
        setHospital(hRes.data.data)
        setReviews(rRes.data.data)
      } catch { navigate('/hospitals') }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  const submitReview = async () => {
    if (!user) { toast.error('Please login to submit a review'); return }
    if (!newReview.comment.trim()) { toast.error('Please write a comment'); return }
    setSubmittingReview(true)
    try {
      const res = await api.post(`/reviews/hospital/${id}`, newReview)
      setReviews(prev => [res.data.data, ...prev])
      setNewReview({ rating: 5, title: '', comment: '' })
      toast.success('Review submitted!')
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to submit review') }
    finally { setSubmittingReview(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  )
  if (!hospital) return null

  const tabs = ['overview', 'doctors', 'schemes', 'reviews']

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft size={16} /> Back to Hospitals
          </button>
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0">
              {hospital.type === 'government' ? '🏛️' : hospital.type === 'ayurvedic' ? '🌿' : '🏥'}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold capitalize">{hospital.type}</span>
                {hospital.isVerified && <span className="text-xs bg-green-400/30 text-green-200 px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Verified</span>}
                {hospital.hasFreeOPD && <span className="text-xs bg-emerald-400/30 text-emerald-100 px-2.5 py-0.5 rounded-full font-bold">FREE OPD</span>}
                {hospital.hasEmergency && <span className="text-xs bg-red-400/30 text-red-100 px-2.5 py-0.5 rounded-full font-bold">EMERGENCY</span>}
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl mb-1">{hospital.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100 text-sm">
                <span className="flex items-center gap-1"><MapPin size={13} />{hospital.address?.city}, {hospital.address?.state} — {hospital.address?.pincode}</span>
                {hospital.isOpen24x7 && <span className="flex items-center gap-1"><Clock size={13} /> Open 24/7</span>}
                <span className="flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /> {hospital.rating?.average?.toFixed(1)} ({hospital.rating?.count?.toLocaleString()} reviews)</span>
              </div>
            </div>
            <Link to={user ? `/appointment/${hospital._id}/${hospital.doctors?.[0]?._id || 'select'}` : '/login'}
              className="flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex-shrink-0">
              <CalendarCheck size={16} /> Book Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Contact quick bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4">
          {hospital.contact?.phone?.[0] && (
            <a href={`tel:${hospital.contact.phone[0]}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
              <Phone size={15} className="text-primary" /> {hospital.contact.phone[0]}
            </a>
          )}
          {hospital.contact?.website && (
            <a href={hospital.contact.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
              <Globe size={15} className="text-primary" /> Website
            </a>
          )}
          {hospital.address?.street && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={15} className="text-primary" /> {hospital.address.street}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold capitalize whitespace-nowrap transition-all ${activeTab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              {hospital.description && (
                <div className="bg-white rounded-2xl p-5 border border-gray-200">
                  <h3 className="font-display font-bold text-gray-900 mb-2">About</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{hospital.description}</p>
                </div>
              )}
              {hospital.specializations?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-200">
                  <h3 className="font-display font-bold text-gray-900 mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specializations.map(s => (
                      <span key={s} className="text-xs bg-blue-50 text-primary px-3 py-1.5 rounded-full font-semibold border border-blue-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {hospital.facilities?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-200">
                  <h3 className="font-display font-bold text-gray-900 mb-3">Facilities</h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {hospital.facilities.map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-gray-700">
                        <CheckCircle2 size={11} className="text-success flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <h3 className="font-display font-bold text-gray-900 mb-3">Key Info</h3>
                <div className="space-y-2.5 text-sm">
                  {[
                    ['Total Beds', hospital.totalBeds],
                    ['ICU Beds', hospital.icuBeds],
                    ['Free OPD', hospital.hasFreeOPD ? '✅ Yes' : '❌ No'],
                    ['Free Medicine', hospital.hasFreeMedicine ? '✅ Yes' : '❌ No'],
                    ['Ambulance', hospital.hasAmbulance ? '✅ Available' : '❌ No'],
                    ['Emergency', hospital.hasEmergency ? '✅ 24/7' : '❌ No'],
                  ].filter(([, v]) => v !== undefined && v !== 0).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-semibold text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {hospital.treatments?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-200">
                  <h3 className="font-display font-bold text-gray-900 mb-3">Treatments & Costs</h3>
                  <div className="space-y-2">
                    {hospital.treatments.map((t, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0 text-sm">
                        <span className="text-gray-700">{t.name}</span>
                        <span className={`font-bold ${t.isFree ? 'text-success' : 'text-primary'}`}>
                          {t.isFree ? 'FREE' : `₹${t.cost?.min}–₹${t.cost?.max}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {hospital.doctors?.length > 0 ? hospital.doctors.map((d) => (
              <div key={d._id} className="bg-white rounded-2xl p-5 border border-gray-200 flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">👨‍⚕️</div>
                <div className="flex-1">
                  <div className="font-display font-bold text-gray-900">{d.name}</div>
                  <div className="text-xs text-primary font-semibold">{d.specialization}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{d.experience} yrs exp · {d.qualifications?.join(', ')}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.isFreeConsultation ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {d.isFreeConsultation ? 'Free' : `₹${d.consultationFee}`}
                    </span>
                    <Link to={user ? `/appointment/${hospital._id}/${d._id}` : '/login'}
                      className="text-xs font-bold text-primary hover:underline">Book →</Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-10 text-gray-400">No doctors listed yet.</div>
            )}
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="space-y-4">
            {hospital.governmentSchemes?.length > 0 ? hospital.governmentSchemes.map((s) => (
              <div key={s._id} className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-display font-bold text-gray-900 mb-1">{s.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{s.description}</p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  {s.benefits?.slice(0, 4).map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-green-600" />{b}</div>
                  ))}
                </div>
                {s.helplineNumber && (
                  <div className="mt-3 text-xs text-green-700 font-semibold">Helpline: {s.helplineNumber}</div>
                )}
              </div>
            )) : (
              <div className="text-center py-10 text-gray-400">No government schemes listed for this hospital.</div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-5">
            {user && (
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <h3 className="font-display font-bold text-gray-900 mb-4">Write a Review</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setNewReview(r => ({...r, rating: n}))}
                          className={`text-2xl transition-transform hover:scale-110 ${n <= newReview.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <input value={newReview.title} onChange={e => setNewReview(r => ({...r, title: e.target.value}))}
                    placeholder="Review title (optional)"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary/50 outline-none" />
                  <textarea value={newReview.comment} onChange={e => setNewReview(r => ({...r, comment: e.target.value}))}
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary/50 outline-none resize-none" />
                  <button onClick={submitReview} disabled={submittingReview}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark disabled:opacity-50 transition-colors">
                    {submittingReview ? <Loader2 size={14} className="animate-spin" /> : null} Submit Review
                  </button>
                </div>
              </div>
            )}
            {reviews.length > 0 ? reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {r.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{r.user?.name}</div>
                      <div className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-amber-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
                {r.title && <div className="font-semibold text-sm text-gray-800 mb-1">{r.title}</div>}
                <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-400">No reviews yet. Be the first to review!</div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
