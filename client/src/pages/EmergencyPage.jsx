// EmergencyPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Phone, MapPin, AlertTriangle } from 'lucide-react'
import api from '../services/api'

export function EmergencyPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (p) => {
        const res = await api.get('/emergency', { params: { lat: p.coords.latitude, lng: p.coords.longitude } })
        setData(res.data.data); setLoading(false)
      },
      async () => { const res = await api.get('/emergency'); setData(res.data.data); setLoading(false) }
    )
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="bg-gradient-to-r from-red-700 to-red-600 py-12 text-white text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-bold mb-4 border border-white/25">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Emergency Mode
        </div>
        <h1 className="font-display font-extrabold text-4xl mb-2">🚨 Medical Emergency</h1>
        <p className="text-red-100 text-base">Showing nearest emergency hospitals and helplines</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {loading ? <div className="flex justify-center py-10"><Loader2 size={32} className="animate-spin text-danger" /></div> : (
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-extrabold text-xl text-gray-900 mb-4">📞 Emergency Helplines</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data?.helplines?.map(h => (
                  <a key={h.number} href={`tel:${h.number}`}
                    className="flex items-center justify-between bg-white border-2 border-danger/20 rounded-2xl px-5 py-4 hover:border-danger/50 hover:shadow-md transition-all group">
                    <div>
                      <div className="font-bold text-gray-900">{h.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 capitalize">{h.type}{h.isFree ? ' · Free' : ''}</div>
                    </div>
                    <div className="font-display font-extrabold text-2xl text-danger group-hover:scale-110 transition-transform flex items-center gap-1.5">
                      <Phone size={18} />{h.number}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            {data?.nearbyHospitals?.length > 0 && (
              <div>
                <h2 className="font-display font-extrabold text-xl text-gray-900 mb-4">🏥 Nearest Emergency Hospitals</h2>
                <div className="space-y-3">
                  {data.nearbyHospitals.map(h => (
                    <div key={h._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🏥</div>
                      <div className="flex-1">
                        <Link to={`/hospitals/${h._id}`} className="font-bold text-gray-900 hover:text-primary">{h.name}</Link>
                        <div className="text-xs text-gray-500 mt-0.5">{h.address?.street}, {h.address?.city}</div>
                        {h.hasAmbulance && <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-1 inline-block">Ambulance Available</span>}
                      </div>
                      {h.contact?.phone?.[0] && (
                        <a href={`tel:${h.contact.phone[0]}`} className="flex items-center gap-1.5 bg-danger text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors flex-shrink-0">
                          <Phone size={14} />{h.contact.phone[0]}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default EmergencyPage
