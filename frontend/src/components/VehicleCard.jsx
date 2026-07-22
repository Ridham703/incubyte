import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import PurchaseModal from './PurchaseModal';
import { Fuel, Gauge, ShieldCheck, Tag, ShoppingBag, Lock } from 'lucide-react';

export const VehicleCard = ({ vehicle, onVehicleUpdate }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    vehicle.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000'
  );

  const isOutOfStock = (vehicle.stock || 0) <= 0;

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseSuccess = (updatedVehicle) => {
    if (onVehicleUpdate) {
      onVehicleUpdate(updatedVehicle);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const getStockBadge = (stock) => {
    if (stock > 3) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> In Stock ({stock})
        </span>
      );
    }
    if (stock > 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
        Out of Stock
      </span>
    );
  };

  return (
    <>
      <div className="group bg-slate-900/70 rounded-2xl border border-slate-800/90 overflow-hidden backdrop-blur-xl hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          <img
            src={imgSrc}
            alt={`${vehicle.make} ${vehicle.model}`}
            onError={() =>
              setImgSrc('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000')
            }
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/60 shadow-lg">
              {vehicle.year}
            </span>
            {getStockBadge(vehicle.stock)}
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-xl text-white font-extrabold text-lg shadow-lg border border-indigo-400/30">
            <Tag className="h-4 w-4" />
            <span>{formatPrice(vehicle.price)}</span>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <span>{vehicle.make}</span>
            </div>
            <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {vehicle.model}
            </h3>
            {vehicle.description && (
              <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">{vehicle.description}</p>
            )}
          </div>

          {/* Specs Pill Badges */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
            <div className="flex items-center space-x-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/40">
              <Fuel className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/40">
              <Gauge className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{(vehicle.mileage || 0).toLocaleString()} mi</span>
            </div>
          </div>

          {/* Purchase Action Button */}
          <div className="pt-2">
            <button
              onClick={handlePurchaseClick}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 hover:shadow-indigo-500/20'
              }`}
            >
              {isOutOfStock ? (
                <span>Out of Stock</span>
              ) : isAuthenticated ? (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Purchase Vehicle</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Sign in to Purchase</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      <PurchaseModal
        vehicle={vehicle}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </>
  );
};

export default VehicleCard;
