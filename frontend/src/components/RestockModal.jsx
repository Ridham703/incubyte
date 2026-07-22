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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="restock-modal-title">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close restock dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400 mb-2">
            <PackagePlus className="h-8 w-8" />
          </div>
          <h3 id="restock-modal-title" className="text-2xl font-extrabold text-white">Restock Inventory</h3>
          <p className="text-sm text-slate-400">Increase stock units for selected vehicle</p>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex justify-between items-center text-sm">
          <div>
            <div className="font-bold text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </div>
            <div className="text-xs text-slate-400">Current Stock</div>
          </div>
          <span className="px-3 py-1 bg-slate-700/80 rounded-xl font-extrabold text-indigo-400 text-base">
            {vehicle.stock} units
          </span>
        </div>

        <form onSubmit={handleRestock} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Units to Add *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full py-3 px-4 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 font-bold text-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-3 px-4 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
