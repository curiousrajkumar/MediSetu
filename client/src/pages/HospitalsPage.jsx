import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, MapPin, Search, X, Loader2 } from 'lucide-react'
import api from '../services/api'
import HospitalCard from '../components/hospital/HospitalCard'

const TYPES = ['All', 'government', 'private', 'trust', 'ayurvedic', 'clinic']
const SPECS = ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics', 'Oncology', 'Dermatology', 'Ophthalmology', 'ENT', 'Dental', 'Psychiatry']

export default function HospitalsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [userLoc, setUserLoc] = useState(null)
  const [locLoading, setLocLoading] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    specialization: searchParams.get('specialization') || '',
    isFree: searchParams.get('free') === 'true',
    hasEmergency: searchParams.get('emergency') === 'true',
    isOpen24x7: searchParams.get('open24') === 'true',
    sort: searchParams.get('sort') || '-rating.average',
    nearby: false,
  })

  const fetchHospitals = useCallback(async (pg = 1) => {
    setLoading(true)
    try {
      const params = { page: pg, limit: 12, sort: filters.sort }
      if (filters.search) params.search = filters.search
      if (filters.city) params.city = filters.city
      if (filters.type && filters.type !== 'All') params.type = filters.type
      if (filters.specialization) params.specialization = filters.specialization
      if (filters.isFree) params.isFree = true
      if (filters.hasEmergency) params.hasEmergency = true
      if (filters.isOpen24x7) params.isOpen24x7 = true
      if (filters.nearby && userLoc) { params.lat = userLoc.lat; params.lng = userLoc.lng; params.radius = 25 }

      const res = await api.get('/hospitals', { params })
      setHospitals(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.pages)
      setPage(pg)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters, userLoc])

  useEffect(() => { fetchHospitals(1) }, [filters])

  const detectLocation = () => {
    setLocLoading(true)
    navigator.geolocation?.getCurrentPosition(
      p => { setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }); setFilters(f => ({ ...f, nearby: true })); setLocLoading(false) },
      () => { alert('Location access denied'); setLocLoading(false) }
    )
  }

  const updateFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }))
  const clearFilters = () => setFilters({ search: '', city: '', type: '', specialization: '', isFree: false, hasEmergency: false, isOpen24x7: false, sort: '-rating.average', nearby: false })
  const activeFilterCount = [filters.type && filters.type !== 'All', filters.specialization, filters.isFree, filters.hasEmergency, filters.isOpen24x7, filters.nearby].filter(Boolean).length

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 mb-4">Find Hospitals Near You</h1>

          {/* Search bar */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={filters.search} onChange={e => updateFilter('search', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchHospitals(1)}
                placeholder="Search hospitals, specializations, diseases..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none" />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={filters.city} onChange={e => updateFilter('city', e.target.value)}
                placeholder="City..."
                className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary/50 outline-none w-40" />
            </div>
            <button onClick={detectLocation} disabled={locLoading}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filters.nearby ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40'}`}>
              {locLoading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
              {filters.nearby ? 'Nearby ON' : 'Use My Location'}
            </button>
            <button onClick={() => setFiltersOpen(p => !p)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white hover:border-primary/40 transition-all relative">
              <SlidersHorizontal size={14} /> Filters
              {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold">{activeFilterCount}</span>}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-danger border border-danger/20 hover:bg-danger/5 transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Type</label>
                <select value={filters.type} onChange={e => updateFilter('type', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-primary/50">
                  {TYPES.map(t => <option key={t} value={t === 'All' ? '' : t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Specialization</label>
                <select value={filters.specialization} onChange={e => updateFilter('specialization', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-primary/50">
                  <option value="">All</option>
                  {SPECS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Sort By</label>
                <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-primary/50">
                  <option value="-rating.average">Highest Rated</option>
                  <option value="-createdAt">Newest</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={filters.isFree} onChange={e => updateFilter('isFree', e.target.checked)} className="w-3.5 h-3.5 accent-green-600" />
                  Free Treatment Only
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={filters.hasEmergency} onChange={e => updateFilter('hasEmergency', e.target.checked)} className="w-3.5 h-3.5 accent-red-600" />
                  Has Emergency
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={filters.isOpen24x7} onChange={e => updateFilter('isOpen24x7', e.target.checked)} className="w-3.5 h-3.5 accent-blue-600" />
                  Open 24/7
                </label>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Found <span className="font-bold text-gray-900">{total}</span> hospitals
              {filters.city && <span> in <span className="font-semibold">{filters.city}</span></span>}
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
                <div className="h-36 bg-gray-100" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-8 bg-gray-100 rounded-xl" />
                    <div className="h-8 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No hospitals found</h3>
            <p className="text-gray-500 text-sm mb-6">Try changing your filters or expanding your search area.</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {hospitals.map((h, i) => <HospitalCard key={h._id} hospital={h} index={i} />)}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button onClick={() => fetchHospitals(page - 1)} disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:border-primary/40 transition-colors">← Prev</button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const p = i + 1
                  return <button key={p} onClick={() => fetchHospitals(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${p === page ? 'bg-primary text-white' : 'border border-gray-200 hover:border-primary/40'}`}>{p}</button>
                })}
                <button onClick={() => fetchHospitals(page + 1)} disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:border-primary/40 transition-colors">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
