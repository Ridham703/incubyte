import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { PackagePlus, X, CheckCircle } from 'lucide-react';

export const RestockModal = ({ vehicle, isOpen, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleRestock = async (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty < 1) {
      toast.error('Restock quantity must be at least 1');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/vehicles/${vehicle._id}/restock`, { quantity: qty });
      const updatedVehicle = res.data?.data?.vehicle || {
        ...vehicle,
        stock: (vehicle.stock || 0) + qty,
      };

      toast.success(`Restocked ${qty} units for ${vehicle.make} ${vehicle.model}!`);
      window.dispatchEvent(new CustomEvent('autosphere-notification', {
        detail: {
          id: Date.now().toString(),
          text: `Restocked ${qty} units for ${vehicle.make} ${vehicle.model}`,
          time: 'Just now',
          type: 'restock'
        }
      }));
      if (onSuccess) onSuccess(updatedVehicle);
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to restock inventory. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="restock-modal-title">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)] space-y-6 text-slate-800 transition-all duration-200">
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close restock dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-50 rounded-2xl border border-cyan-100 text-cyan-600 mb-2 shadow-sm">
            <PackagePlus className="h-6 w-6" />
          </div>
          <h3 id="restock-modal-title" className="text-2xl font-black text-slate-950 tracking-tight">Restock Inventory</h3>
          <p className="text-xs text-slate-500 font-medium">Increase stock units for selected vehicle</p>
        </div>

        <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/60 flex justify-between items-center text-sm">
          <div>
            <div className="font-bold text-slate-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Current Stock</div>
          </div>
          <span className="px-3.5 py-1.5 bg-slate-100 rounded-xl font-extrabold text-blue-600 text-base border border-slate-200/60">
            {vehicle.stock} units
          </span>
        </div>

        <form onSubmit={handleRestock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Units to Add *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full py-3 px-4 premium-input rounded-2xl text-slate-900 font-bold text-lg text-center focus:outline-none"
              required
            />
          </div>

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
              type="submit"
              disabled={loading}
              className="w-1/2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-white/10 shadow-sm transition-all disabled:opacity-50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Restocking...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Add Stock</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;
