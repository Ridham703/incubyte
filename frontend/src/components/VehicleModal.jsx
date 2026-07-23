import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { X, PlusCircle, Edit3, Car, Image as ImageIcon, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'CVT'];

export const VehicleModal = ({ vehicle, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'file'
  const [imagePreview, setImagePreview] = useState('');
  const isEditing = Boolean(vehicle && vehicle._id);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const watchImageUrl = watch('image');

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
        setImagePreview(vehicle.image || '');
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
        setImagePreview('');
      }
      setImageMode('url');
    }
  }, [isOpen, vehicle, reset]);

  // Update preview when URL changes in URL mode
  useEffect(() => {
    if (imageMode === 'url') {
      setImagePreview(watchImageUrl || '');
    }
  }, [watchImageUrl, imageMode]);

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setValue('image', base64Data);
        setImagePreview(base64Data);
        toast.success('Image loaded for preview!');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setValue('image', '');
    setImagePreview('');
  };

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
        window.dispatchEvent(new CustomEvent('autosphere-notification', {
          detail: {
            id: Date.now().toString(),
            text: `Updated specifications for ${payload.make} ${payload.model}`,
            time: 'Just now',
            type: 'edit'
          }
        }));
      } else {
        res = await api.post('/vehicles', payload);
        toast.success(`Added ${payload.make} ${payload.model} to inventory!`);
        window.dispatchEvent(new CustomEvent('autosphere-notification', {
          detail: {
            id: Date.now().toString(),
            text: `Added new vehicle ${payload.make} ${payload.model} to inventory`,
            time: 'Just now',
            type: 'add'
          }
        }));
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

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError.message || 'Please fill in all required fields.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl space-y-6 my-8 text-slate-800 transition-all duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close vehicle form dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600 shadow-sm">
            {isEditing ? <Edit3 className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
          </div>
          <div>
            <h3 id="vehicle-modal-title" className="text-2xl font-black text-slate-950 tracking-tight">
              {isEditing ? 'Vehicle Edit Form' : 'Vehicle Add Form'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Fill in the specification details for dealership inventory</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Make *
              </label>
              <input
                type="text"
                id="make"
                aria-invalid={Boolean(errors.make)}
                aria-describedby={errors.make ? 'make-error' : undefined}
                {...register('make', {
                  required: 'Make is required',
                  minLength: { value: 2, message: 'Make must be at least 2 characters' },
                })}
                placeholder="e.g. BMW, Tesla, Audi"
                className={`w-full py-2.5 px-3.5 premium-input ${
                  errors.make ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                } text-slate-900 text-sm focus:outline-none`}
              />
              {errors.make && <p id="make-error" className="mt-1 text-xs text-rose-500 font-bold">{errors.make.message}</p>}
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Model *
              </label>
              <input
                type="text"
                id="model"
                aria-invalid={Boolean(errors.model)}
                aria-describedby={errors.model ? 'model-error' : undefined}
                {...register('model', {
                  required: 'Model is required',
                  minLength: { value: 2, message: 'Model must be at least 2 characters' },
                })}
                placeholder="e.g. M3, Model 3, RS5"
                className={`w-full py-2.5 px-3.5 premium-input ${
                  errors.model ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                } text-slate-900 text-sm focus:outline-none`}
              />
              {errors.model && <p id="model-error" className="mt-1 text-xs text-rose-500 font-bold">{errors.model.message}</p>}
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Year *
              </label>
              <input
                type="number"
                {...register('year', {
                  required: 'Year is required',
                  min: { value: 1900, message: 'Year must be >= 1900' },
                  max: { value: new Date().getFullYear() + 2, message: 'Invalid manufacturing year' },
                })}
                className={`w-full py-2.5 px-3.5 premium-input ${
                  errors.year ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                } text-slate-900 text-sm focus:outline-none`}
              />
              {errors.year && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.year.message}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Price ($) *
              </label>
              <input
                type="number"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' },
                })}
                placeholder="e.g. 65000"
                className={`w-full py-2.5 px-3.5 premium-input ${
                  errors.price ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                } text-slate-900 text-sm focus:outline-none`}
              />
              {errors.price && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.price.message}</p>}
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Mileage (mi) *
              </label>
              <input
                type="number"
                {...register('mileage', {
                  required: 'Mileage is required',
                  min: { value: 0, message: 'Mileage cannot be negative' },
                })}
                placeholder="e.g. 12000"
                className={`w-full py-2.5 px-3.5 premium-input ${
                  errors.mileage ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                } text-slate-900 text-sm focus:outline-none`}
              />
              {errors.mileage && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.mileage.message}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Initial Stock Units *
              </label>
              <input
                type="number"
                {...register('stock', {
                  required: 'Stock is required',
                  min: { value: 0, message: 'Stock cannot be negative' },
                })}
                className={`w-full py-2.5 px-3.5 premium-input ${
                  errors.stock ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                } text-slate-900 text-sm focus:outline-none`}
              />
              {errors.stock && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.stock.message}</p>}
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Fuel Type *
              </label>
              <select
                {...register('fuelType', { required: 'Fuel type is required' })}
                className="w-full py-2.5 px-3.5 premium-input rounded-xl text-slate-800 text-sm focus:outline-none"
              >
                {FUEL_TYPES.map((fuel) => (
                  <option key={fuel} value={fuel} className="bg-white text-slate-800">
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Transmission *
              </label>
              <select
                {...register('transmission', { required: 'Transmission is required' })}
                className="w-full py-2.5 px-3.5 premium-input rounded-xl text-slate-800 text-sm focus:outline-none"
              >
                {TRANSMISSION_TYPES.map((trans) => (
                  <option key={trans} value={trans} className="bg-white text-slate-800">
                    {trans}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vehicle Image Field
              </label>
              <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    imageMode === 'url' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850'
                  }`}
                >
                  <LinkIcon className="h-3 w-3" />
                  <span>URL Input</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    imageMode === 'file' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850'
                  }`}
                >
                  <Upload className="h-3 w-3" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            {imageMode === 'url' ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <input
                  type="url"
                  {...register('image')}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-3.5 py-2.5 premium-input rounded-xl text-slate-900 text-sm focus:outline-none"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  id="vehicle-image-upload"
                  className="hidden"
                />
                <label
                  htmlFor="vehicle-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Click to upload vehicle photo <span className="text-blue-600">(Max 5MB)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Supports PNG, JPG, WEBP formats</div>
                </label>
              </div>
            )}

            {/* Live Image Preview */}
            {imagePreview && (
              <div className="relative mt-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[16/7] shadow-sm">
                <img src={imagePreview} alt="Live Vehicle Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-rose-600/90 text-white rounded-xl hover:bg-rose-500 transition-all shadow-md border border-white/10"
                  title="Remove Image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              {...register('description')}
              placeholder="Provide key features or vehicle details..."
              className="w-full py-2.5 px-3.5 premium-input rounded-xl text-slate-900 text-sm focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all disabled:opacity-50 min-h-[44px] focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-white/10 shadow-sm transition-all disabled:opacity-50 min-h-[44px] focus:outline-none active:scale-[0.98]"
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
