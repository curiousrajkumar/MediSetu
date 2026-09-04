import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, AlertCircle, ChevronRight, Loader2 } from 'lucide-react'
import api from '../../services/api'

const QUICK_CHIPS = [
  'Fever, headache, body ache',
  'Chest pain, breathlessness',
  'Diabetes treatment',
  'Joint pain, swelling',
  'Skin rash, itching',
  'Eye infection',
  'Dental pain',
  'Blood pressure',
]

export default function AISymptomChecker({ onHospitalsFound }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async (text) => {
    const q = text || input
    if (!q.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const loc = await getLocation()
      const res = await api.post('/ai/analyze', {
        symptoms: q,
        lat: loc?.lat,
        lng: loc?.lng,
      })
      setResult(res.data.data)
      if (res.data.data?.matchingHospitals?.length > 0 && onHospitalsFound) {
        onHospitalsFound(res.data.data.matchingHospitals)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getLocation = () => new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { timeout: 4000 }
    )
  })

  const urgencyColor = {
    'Immediate': 'bg-red-100 text-red-700 border-red-200',
    'Within 24h': 'bg-orange-100 text-orange-700 border-orange-200',
    'Within a week': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Routine': 'bg-green-100 text-green-700 border-green-200',
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input */}
      <div className="bg-white rounded-2xl shadow-card border border-primary/10 p-5">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles size={13} className="text-primary" /> AI Symptom Analyzer
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="Enter symptoms e.g. fever, headache, weakness..."
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-sm outline-none transition-all"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => analyze()}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all flex items-center gap-2 flex-shrink-0"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Analyze
          </motion.button>
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-xs text-gray-400 self-center">Try:</span>
          {QUICK_CHIPS.map(chip => (
            <button key={chip} onClick={() => { setInput(chip); analyze(chip) }}
              className="text-xs bg-gray-50 hover:bg-primary/8 hover:text-primary border border-gray-200 hover:border-primary/25 rounded-full px-3 py-1 transition-all text-gray-600 font-medium">
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5 text-sm text-red-700">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-3 bg-white rounded-2xl shadow-card border border-primary/10 p-5">
            <div className="flex items-center gap-3 text-primary">
              <Loader2 size={20} className="animate-spin" />
              <div>
                <div className="font-semibold text-sm">AI is analyzing your symptoms...</div>
                <div className="text-xs text-gray-400 mt-0.5">This takes just a few seconds</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded-full animate-pulse" style={{ width: `${75 - i * 15}%` }} />
              ))}
            </div>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-white rounded-2xl shadow-card border border-primary/10 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">🤖 AI Analysis Result</div>
                <div className="text-xs text-gray-400">Not a medical diagnosis — consult a doctor</div>
              </div>
              {result.analysis?.urgencyLevel && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${urgencyColor[result.analysis.urgencyLevel] || 'bg-gray-100 text-gray-600'}`}>
                  {result.analysis.urgencyLevel}
                </span>
              )}
            </div>

            {/* Possible conditions */}
            {result.analysis?.possibleConditions?.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Possible Conditions</div>
                <div className="space-y-2">
                  {result.analysis.possibleConditions.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 bg-blue-50 rounded-xl">
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${c.probability === 'High' ? 'bg-red-400' : c.probability === 'Medium' ? 'bg-amber-400' : 'bg-green-400'}`} />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{c.name}
                          <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${c.probability === 'High' ? 'bg-red-100 text-red-700' : c.probability === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {c.probability}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{c.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended specialist */}
            {result.analysis?.recommendedSpecialist && (
              <div className="flex items-center gap-2.5 p-3 bg-green-50 rounded-xl border border-green-100">
                <span className="text-lg">👨‍⚕️</span>
                <div>
                  <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Recommended Specialist</div>
                  <div className="text-sm font-semibold text-gray-800">{result.analysis.recommendedSpecialist}</div>
                </div>
              </div>
            )}

            {/* First aid tips */}
            {result.analysis?.firstAidTips?.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">First Aid Tips</div>
                <ul className="space-y-1">
                  {result.analysis.firstAidTips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <ChevronRight size={12} className="text-primary mt-0.5 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Free schemes */}
            {result.analysis?.freeSchemes?.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">💳 Free Govt. Schemes Available</div>
                {result.analysis.freeSchemes.map((s, i) => (
                  <div key={i} className="text-xs text-gray-700">• {s}</div>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2.5 leading-relaxed">
              ⚠️ {result.analysis?.disclaimer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
