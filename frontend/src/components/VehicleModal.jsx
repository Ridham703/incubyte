import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { X, PlusCircle, Edit3, Car, Image as ImageIcon } from 'lucide-react';

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'CVT'];

export const VehicleModal = ({ vehicle, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(vehicle && vehicle._id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      mileage: '',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      stock: 1,
      image: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        reset({
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          price: vehicle.price || '',
          mileage: vehicle.mileage || '',
          fuelType: vehicle.fuelType || 'Gasoline',
          transmission: vehicle.transmission || 'Automatic',
          stock: vehicle.stock ?? 1,
          image: vehicle.image || '',
          description: vehicle.description || '',
        });
      } else {
        reset({
          make: '',
          model: '',
          year: new Date().getFullYear(),
          price: '',
          mileage: '',
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          stock: 1,
          image: '',
          description: '',
        });
      }
    }
  }, [isOpen, vehicle, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        year: Number(data.year),
        price: Number(data.price),
        mileage: Number(data.mileage),
        stock: Number(data.stock),
      };

      let res;
      if (isEditing) {
        res = await api.put(`/vehicles/${vehicle._id}`, payload);
        toast.success(`Updated ${payload.make} ${payload.model} successfully!`);
      } else {
        res = await api.post('/vehicles', payload);
        toast.success(`Added ${payload.make} ${payload.model} to inventory!`);
      }

      const savedVehicle = res.data?.data?.vehicle || payload;
      if (onSuccess) onSuccess(savedVehicle);
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save vehicle details. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/80 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
            {isEditing ? <Edit3 className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">
              {isEditing ? 'Edit Vehicle Details' : 'Add New Vehicle'}
            </h3>
            <p className="text-xs text-slate-400">Fill in the specification details for dealership inventory</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Make *
              </label>
              <input
                type="text"
                {...register('make', { required: 'Make is required' })}
                placeholder="e.g. BMW, Tesla, Audi"
                className={`w-full py-2.5 px-3.5 bg-slate-800/80 border ${
                  errors.make ? 'border-red-500/80' : 'border-slate-700/80'
                } rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              />
              {errors.make && <p className="mt-1 text-xs text-red-400 font-medium">{errors.make.message}</p>}
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Model *
              </label>
              <input
                type="text"
                {...register('model', { required: 'Model is required' })}
                placeholder="e.g. M3, Model 3, RS5"
                className={`w-full py-2.5 px-3.5 bg-slate-800/80 border ${
                  errors.model ? 'border-red-500/80' : 'border-slate-700/80'
                } rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              />
              {errors.model && <p className="mt-1 text-xs text-red-400 font-medium">{errors.model.message}</p>}
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Year *
              </label>
              <input
                type="number"
                {...register('year', {
                  required: 'Year is required',
                  min: { value: 1900, message: 'Year must be >= 1900' },
                  max: { value: new Date().getFullYear() + 2, message: 'Invalid year' },
                })}
                className={`w-full py-2.5 px-3.5 bg-slate-800/80 border ${
                  errors.year ? 'border-red-500/80' : 'border-slate-700/80'
                } rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              />
              {errors.year && <p className="mt-1 text-xs text-red-400 font-medium">{errors.year.message}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Price ($) *
              </label>
              <input
                type="number"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' },
                })}
                placeholder="e.g. 65000"
                className={`w-full py-2.5 px-3.5 bg-slate-800/80 border ${
                  errors.price ? 'border-red-500/80' : 'border-slate-700/80'
                } rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              />
              {errors.price && <p className="mt-1 text-xs text-red-400 font-medium">{errors.price.message}</p>}
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mileage (mi) *
              </label>
              <input
                type="number"
                {...register('mileage', {
                  required: 'Mileage is required',
                  min: { value: 0, message: 'Mileage cannot be negative' },
                })}
                placeholder="e.g. 12000"
                className={`w-full py-2.5 px-3.5 bg-slate-800/80 border ${
                  errors.mileage ? 'border-red-500/80' : 'border-slate-700/80'
                } rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              />
              {errors.mileage && <p className="mt-1 text-xs text-red-400 font-medium">{errors.mileage.message}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Initial Stock Units *
              </label>
              <input
                type="number"
                {...register('stock', {
                  required: 'Stock is required',
                  min: { value: 0, message: 'Stock cannot be negative' },
                })}
                className={`w-full py-2.5 px-3.5 bg-slate-800/80 border ${
                  errors.stock ? 'border-red-500/80' : 'border-slate-700/80'
                } rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              />
              {errors.stock && <p className="mt-1 text-xs text-red-400 font-medium">{errors.stock.message}</p>}
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Fuel Type *
              </label>
              <select
                {...register('fuelType', { required: 'Fuel type is required' })}
                className="w-full py-2.5 px-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {FUEL_TYPES.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Transmission *
              </label>
              <select
                {...register('transmission', { required: 'Transmission is required' })}
                className="w-full py-2.5 px-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {TRANSMISSION_TYPES.map((trans) => (
                  <option key={trans} value={trans}>
                    {trans}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Image URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ImageIcon className="h-4 w-4" />
              </div>
              <input
                type="url"
                {...register('image')}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              {...register('description')}
              placeholder="Provide key features or details..."
              className="w-full py-2.5 px-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-3 px-4 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5">
                  <Car className="h-4 w-4" />
                  <span>{isEditing ? 'Update Vehicle' : 'Save Vehicle'}</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
