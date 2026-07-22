import React from 'react';
import { Eye, Edit2, Trash2, Gauge, Calendar, Fuel, ShieldCheck, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const CarCard = ({ car, onView, onEdit, onDelete, onStatusChange }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Sold':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Reserved':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'In Maintenance':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';
  const imageUrl = car.images && car.images.length > 0 ? car.images[0] : defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-2xl glass-card border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-primary-500/40 hover:shadow-glow transition-all duration-300"
    >
      <div>
        {/* Image & Status Overlay */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={imageUrl}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-80" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${getStatusBadge(
                car.status
              )}`}
            >
              {car.status}
            </span>
          </div>

          {/* Body Type Pill */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-black/40 text-slate-300 border border-white/10 backdrop-blur-md">
              {car.bodyType}
            </span>
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {formatCurrency(car.price)}
            </span>
            <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
              {car.fuelType}
            </span>
          </div>
        </div>

        {/* Vehicle Title & Specs */}
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {car.year} {car.make} {car.model}
              </h4>
              <p className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-primary-400" /> VIN: {car.vin}
              </p>
            </div>
          </div>

          {/* Key Attribute Pills */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center text-xs text-slate-300 gap-1.5 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>{car.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex items-center text-xs text-slate-300 gap-1.5 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{car.transmission}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-2">
        <button
          onClick={() => onView(car)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-primary-600/80 text-xs font-semibold text-slate-200 hover:text-white transition"
        >
          <Eye className="w-3.5 h-3.5" /> Details
        </button>

        <button
          onClick={() => onEdit(car)}
          className="flex items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          title="Edit Vehicle"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(car)}
          className="flex items-center justify-center p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition"
          title="Delete Vehicle"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default CarCard;
