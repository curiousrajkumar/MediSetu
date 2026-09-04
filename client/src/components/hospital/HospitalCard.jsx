import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, Clock, Phone, ArrowRight, CalendarCheck } from 'lucide-react'

const typeColors = {
  government: 'bg-green-100 text-green-800',
  private: 'bg-blue-100 text-blue-800',
  trust: 'bg-purple-100 text-purple-800',
  ayurvedic: 'bg-amber-100 text-amber-800',
  clinic: 'bg-teal-100 text-teal-800',
}

const typeEmojis = {
  government: '🏛️', private: '🏥', trust: '🏨',
  ayurvedic: '🌿', clinic: '🏪'
}

export default function HospitalCard({ hospital, index = 0 }) {
  const {
    _id, name, address, type, rating, isOpen24x7,
    hasFreeOPD, hasEmergency, specializations = [],
    contact, coverImage
  } = hospital

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-blue-50 shadow-card overflow-hidden hover-lift group"
    >
      {/* Image / header */}
      <div className="h-36 bg-gradient-to-br from-primary/10 to-success/10 flex items-center justify-center relative overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">{typeEmojis[type] || '🏥'}</span>
        )}
        {/* badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {hasFreeOPD && (
            <span className="text-[10px] font-bold bg-success text-white px-2 py-0.5 rounded-full shadow-sm">FREE OPD</span>
          )}
          {hasEmergency && (
            <span className="text-[10px] font-bold bg-danger text-white px-2 py-0.5 rounded-full shadow-sm">EMERGENCY</span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${typeColors[type] || 'bg-gray-100 text-gray-700'}`}>
            {typeEmojis[type]} {type}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin size={11} className="text-primary flex-shrink-0" />
          <span className="line-clamp-1">{address?.city}, {address?.state}</span>
        </div>

        {/* Rating + Hours */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-gray-800">{rating?.average?.toFixed(1) || 'N/A'}</span>
            <span className="text-xs text-gray-400">({rating?.count || 0})</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${isOpen24x7 ? 'text-success' : 'text-gray-500'}`}>
            <Clock size={11} />
            {isOpen24x7 ? 'Open 24/7' : 'View Hours'}
          </div>
        </div>

        {/* Specializations */}
        {specializations.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {specializations.slice(0, 3).map(s => (
              <span key={s} className="text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/15">
                {s}
              </span>
            ))}
            {specializations.length > 3 && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                +{specializations.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link to={`/hospitals/${_id}`}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-primary/20 text-primary text-xs font-bold hover:bg-primary/5 transition-colors">
            View Details <ArrowRight size={12} />
          </Link>
          <Link to={`/hospitals/${_id}`}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-sm hover:shadow-md transition-all">
            <CalendarCheck size={12} /> Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
