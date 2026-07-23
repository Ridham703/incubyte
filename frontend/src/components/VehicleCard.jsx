import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import PurchaseModal from './PurchaseModal';
import toast from 'react-hot-toast';
import { Fuel, Gauge, ShieldCheck, Tag, ShoppingBag, Lock, Layers, Heart } from 'lucide-react';

export const VehicleCard = ({ vehicle, onVehicleUpdate }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    vehicle.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000'
  );

  const stockCount = vehicle.stock || 0;
  const isOutOfStock = stockCount <= 0;
  const stockPercentage = Math.min(100, Math.max(0, (stockCount / 10) * 100));

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      toast.error('Authentication required. Please sign in to purchase.');
      navigate('/login');
      return;
    }
    setIsPurchaseModalOpen(true);
  };

  const handleFavoriteToggle = () => {
    const nextVal = !isFavorite;
    setIsFavorite(nextVal);
    window.dispatchEvent(new CustomEvent('autosphere-notification', {
      detail: {
        id: Date.now().toString(),
        text: nextVal 
          ? `Added ${vehicle.make} ${vehicle.model} to favorites`
          : `Removed ${vehicle.make} ${vehicle.model} from favorites`,
        time: 'Just now',
        type: 'favorite'
      }
    }));
  };

  const handlePurchaseSuccess = (updatedVehicle) => {
    if (onVehicleUpdate) {
      onVehicleUpdate(updatedVehicle);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const getStockBadge = (stock) => {
    if (stock > 3) {
      return (
        <span className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5" /> In Stock ({stock})
        </span>
      );
    }
    if (stock > 0) {
      return (
        <span className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
        Out of Stock
      </span>
    );
  };

  return (
    <>
      <div className="group bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-200 flex flex-col h-full relative">
        {/* Favorite Icon */}
        <button
          onClick={handleFavoriteToggle}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-md text-slate-400 hover:text-rose-500 hover:scale-105 transition-all duration-200 border border-slate-100"
        >
          <Heart className={`h-4 w-4 transition-colors duration-200 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={imgSrc}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} — ${vehicle.fuelType}, ${(vehicle.mileage || 0).toLocaleString()} miles`}
            onError={() =>
              setImgSrc('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000')
            }
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-80" />

          {/* Year Badge */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900/90 text-white shadow-sm">
              {vehicle.year}
            </span>
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-blue-600 font-extrabold text-lg shadow-md border border-slate-100">
            <Tag className="h-4 w-4" />
            <span>{formatPrice(vehicle.price)}</span>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              <span>{vehicle.make}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {vehicle.model}
            </h3>
            {vehicle.description && (
              <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{vehicle.description}</p>
            )}
          </div>

          {/* Specs Pill Badges */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600 font-bold">
            <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100">
              <Fuel className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100">
              <Gauge className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{(vehicle.mileage || 0).toLocaleString()} mi</span>
            </div>
          </div>

          {/* Stock Level Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" /> Availability
              </span>
              {getStockBadge(vehicle.stock)}
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  stockCount > 3
                    ? 'bg-emerald-500'
                    : stockCount > 0
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
          </div>

          {/* Purchase Action Button */}
          <div className="pt-2">
            <button
              onClick={handlePurchaseClick}
              disabled={isOutOfStock}
              aria-label={
                isOutOfStock
                  ? `${vehicle.make} ${vehicle.model} is out of stock`
                  : isAuthenticated
                    ? `Purchase ${vehicle.make} ${vehicle.model}`
                    : `Sign in to purchase ${vehicle.make} ${vehicle.model}`
              }
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl text-xs font-bold transition-all shadow-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-white/10 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
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
