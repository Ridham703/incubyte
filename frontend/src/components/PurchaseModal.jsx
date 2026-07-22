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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/80 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-2">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">Confirm Purchase</h3>
          <p className="text-sm text-slate-400">Please review your order details before completing purchase.</p>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">Vehicle:</span>
            <span className="font-bold text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">Stock Available:</span>
            <span className="font-semibold text-emerald-400">{vehicle.stock} units</span>
          </div>
          <div className="pt-2 border-t border-slate-700/60 flex justify-between items-center text-base">
            <span className="text-slate-300 font-bold">Total Price:</span>
            <span className="text-xl font-extrabold text-indigo-400">{formatPrice(vehicle.price)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-1/2 py-3 px-4 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePurchase}
            disabled={loading}
            className="w-1/2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
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
