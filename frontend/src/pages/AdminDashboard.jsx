import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import VehicleModal from '../components/VehicleModal';
import RestockModal from '../components/RestockModal';
import {
  Car,
  DollarSign,
  PackageCheck,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  PackagePlus,
  RefreshCw,
  Search,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles', { params: { limit: 100 } });
      setVehicles(res.data?.data?.vehicles || []);
    } catch {
      toast.error('Failed to load inventory for admin dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const totalVehicles = vehicles.length;
    const totalValuation = vehicles.reduce((sum, v) => sum + (v.price || 0) * (v.stock || 0), 0);
    const inStock = vehicles.filter((v) => (v.stock || 0) > 0).length;
    const outOfStock = vehicles.filter((v) => (v.stock || 0) <= 0).length;

    return { totalVehicles, totalValuation, inStock, outOfStock };
  }, [vehicles]);

  // Filtered Table List
  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicles;
    const query = searchQuery.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.make?.toLowerCase().includes(query) ||
        v.model?.toLowerCase().includes(query) ||
        v.year?.toString().includes(query)
    );
  }, [vehicles, searchQuery]);

  // CRUD Handlers
  const handleCreateNew = () => {
    setSelectedVehicle(null);
    setIsVehicleModalOpen(true);
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleRestock = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRestockModalOpen(true);
  };

  const handleDelete = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to soft delete ${vehicle.make} ${vehicle.model}?`)) {
      return;
    }

    setDeletingId(vehicle._id);
    try {
      await api.delete(`/vehicles/${vehicle._id}`);
      toast.success(`Soft deleted ${vehicle.make} ${vehicle.model}`);
      setVehicles((prev) => prev.filter((v) => v._id !== vehicle._id));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete vehicle';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleVehicleSaved = (savedVehicle) => {
    setVehicles((prev) => {
      const exists = prev.some((v) => v._id === savedVehicle._id);
      if (exists) {
        return prev.map((v) => (v._id === savedVehicle._id ? savedVehicle : v));
      }
      return [savedVehicle, ...prev];
    });
  };

  const handleRestockSuccess = (updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v._id === updatedVehicle._id ? updatedVehicle : v))
    );
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Management Panel</h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time dealership inventory control, statistics, and CRUD actions
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          aria-label="Add new vehicle to inventory"
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Statistics Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Vehicles */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inventory</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{stats.totalVehicles} Models</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
            <Car className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Inventory Valuation */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Valuation</p>
            <h3 className="text-2xl font-extrabold text-cyan-400 mt-1">{formatCurrency(stats.totalValuation)}</h3>
          </div>
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: In Stock */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active In-Stock</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.inStock} Models</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <PackageCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Out of Stock</p>
            <h3 className="text-2xl font-extrabold text-red-400 mt-1">{stats.outOfStock} Models</h3>
          </div>
          <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Table Action Controls */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              aria-label="Search inventory table"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table by make, model, or year..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={fetchVehicles}
            disabled={loading}
            className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Reload Inventory</span>
          </button>
        </div>

        {/* Inventory Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300" aria-label="Vehicle Inventory Table">
            <caption className="sr-only">Inventory Management Table</caption>
            <thead className="bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Vehicle Model</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Specs</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium" aria-live="polite" aria-busy={loading}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      <span>Loading inventory data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No vehicle records found.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Vehicle info with Image */}
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <img
                        src={
                          vehicle.image ||
                          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=100'
                        }
                        alt={vehicle.model}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-950 border border-slate-800"
                      />
                      <div>
                        <div className="font-bold text-white">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">
                          {vehicle.description || 'No description'}
                        </div>
                      </div>
                    </td>

                    {/* Year */}
                    <td className="py-3.5 px-4 font-semibold text-slate-300">{vehicle.year}</td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-extrabold text-indigo-400">
                      {formatCurrency(vehicle.price)}
                    </td>

                    {/* Stock Badge */}
                    <td className="py-3.5 px-4">
                      {vehicle.stock > 3 ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {vehicle.stock} in stock
                        </span>
                      ) : vehicle.stock > 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {vehicle.stock} low stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                          Out of stock
                        </span>
                      )}
                    </td>

                    {/* Specs */}
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      <div>{vehicle.fuelType}</div>
                      <div>{vehicle.transmission}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Restock Button */}
                        <button
                          onClick={() => handleRestock(vehicle)}
                          aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
                          title="Restock Inventory"
                          className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <PackagePlus className="h-4 w-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(vehicle)}
                          aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                          title="Edit Vehicle"
                          className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(vehicle)}
                          disabled={deletingId === vehicle._id}
                          aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                          title="Delete Vehicle"
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      <VehicleModal
        vehicle={selectedVehicle}
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSuccess={handleVehicleSaved}
      />

      {/* Restock Modal */}
      <RestockModal
        vehicle={selectedVehicle}
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        onSuccess={handleRestockSuccess}
      />
    </div>
  );
};

export default AdminDashboard;
