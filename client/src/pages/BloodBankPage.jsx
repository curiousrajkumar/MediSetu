// BloodBankPage.jsx
import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Loader2 } from 'lucide-react'

export function BloodBankPage() {
  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(true)
  const [bloodGroup, setBloodGroup] = useState('')

  const fetch = async () => {
    setLoading(true)
    const res = await api.get('/blood-banks', { params: { bloodGroup } })
    setBanks(res.data.data); setLoading(false)
  }
  useEffect(() => { fetch() }, [bloodGroup])

  const GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-700 to-red-500 py-10 text-white text-center">
        <h1 className="font-display font-extrabold text-3xl mb-2">🩸 Blood Bank Finder</h1>
        <p className="text-red-100">Find blood availability near you</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button onClick={() => setBloodGroup('')} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${bloodGroup === '' ? 'bg-danger text-white border-danger' : 'bg-white text-gray-700 border-gray-200 hover:border-danger/40'}`}>All Groups</button>
          {GROUPS.map(g => <button key={g} onClick={() => setBloodGroup(g)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${bloodGroup === g ? 'bg-danger text-white border-danger' : 'bg-white text-gray-700 border-gray-200 hover:border-danger/40'}`}>{g}</button>)}
        </div>
        {loading ? <div className="flex justify-center py-10"><Loader2 size={28} className="animate-spin text-danger" /></div> : (
          <div className="space-y-5">
            {banks.map(b => (
              <div key={b._id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-gray-900">{b.name}</h3>
                    <p className="text-sm text-gray-500">{b.address?.city}, {b.address?.state}</p>
                    <div className="flex gap-2 mt-1.5">
                      {b.isOpen24x7 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Open 24/7</span>}
                      {b.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">FREE</span>}
                    </div>
                  </div>
                  {b.contact?.phone?.[0] && <a href={`tel:${b.contact.phone[0]}`} className="text-sm font-bold text-danger hover:underline">{b.contact.phone[0]}</a>}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {b.availability?.map(a => (
                    <div key={a.bloodGroup} className={`text-center rounded-xl p-2 border ${a.units > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="font-display font-extrabold text-sm text-danger">{a.bloodGroup}</div>
                      <div className={`text-xs font-semibold ${a.units > 0 ? 'text-green-700' : 'text-gray-400'}`}>{a.units > 0 ? `${a.units} units` : 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {banks.length === 0 && <div className="text-center py-12 text-gray-400">No blood banks found for selected group.</div>}
          </div>
        )}
      </div>
    </main>
  )
}

// SchemesPage.jsx
export function SchemesPage() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.get('/schemes').then(r => { setSchemes(r.data.data); setLoading(false) }) }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-green-500 py-10 text-white text-center">
        <h1 className="font-display font-extrabold text-3xl mb-2">🏛️ Government Healthcare Schemes</h1>
        <p className="text-green-100">Free and subsidized treatment for eligible citizens</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? <div className="flex justify-center py-10"><Loader2 size={28} className="animate-spin text-success" /></div> : (
          <div className="space-y-5">
            {schemes.map(s => (
              <div key={s._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🌿</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-bold text-gray-900 text-lg">{s.name}</h3>
                      {s.shortName && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{s.shortName}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.launchedBy === 'central' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{s.launchedBy === 'central' ? 'Central Govt.' : `${s.state} State`}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{s.description}</p>
                    {s.benefits?.length > 0 && <div className="mb-2"><div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Benefits</div>
                      <div className="grid sm:grid-cols-2 gap-1">{s.benefits.map((b, i) => <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700"><span className="text-success font-bold mt-0.5">✓</span>{b}</div>)}</div></div>}
                    {s.eligibility?.length > 0 && <div className="mb-2"><div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Eligibility</div>
                      <div className="flex flex-wrap gap-1.5">{s.eligibility.map((e, i) => <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{e}</span>)}</div></div>}
                    {s.helplineNumber && <div className="mt-3 text-sm font-bold text-green-700">📞 Helpline: <a href={`tel:${s.helplineNumber}`} className="hover:underline">{s.helplineNumber}</a></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default BloodBankPage
