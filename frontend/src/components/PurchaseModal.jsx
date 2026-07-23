import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ShoppingBag, X, CheckCircle } from 'lucide-react';

export const PurchaseModal = ({ vehicle, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/vehicles/${vehicle._id}/purchase`, { quantity: 1 });
      const updatedVehicle = res.data?.data?.vehicle || {
        ...vehicle,
        stock: Math.max(0, vehicle.stock - 1),
      };

      toast.success(`Successfully purchased ${vehicle.make} ${vehicle.model}!`);
      window.dispatchEvent(new CustomEvent('autosphere-notification', {
        detail: {
          id: Date.now().toString(),
          text: `Purchased ${vehicle.make} ${vehicle.model} successfully!`,
          time: 'Just now',
          type: 'purchase'
        }
      }));
      if (onSuccess) onSuccess(updatedVehicle);
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to complete vehicle purchase. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="purchase-modal-title">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)] space-y-6 text-slate-800 transition-all duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close purchase dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600 mb-2 shadow-sm">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 id="purchase-modal-title" className="text-2xl font-black text-slate-950 tracking-tight">Confirm Purchase</h3>
          <p className="text-xs text-slate-500 font-medium">Please review your order details before completing purchase.</p>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/60 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-bold">Vehicle:</span>
            <span className="font-extrabold text-slate-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-bold">Stock Available:</span>
            <span className="font-extrabold text-emerald-600">{vehicle.stock} units</span>
          </div>
          <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center text-base">
            <span className="text-slate-700 font-extrabold">Total Price:</span>
            <span className="text-xl font-black text-blue-600">{formatPrice(vehicle.price)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-1/2 py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all disabled:opacity-50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePurchase}
            disabled={loading}
            className="w-1/2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-white/10 shadow-sm transition-all disabled:opacity-50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4" />
                <span>Confirm</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
