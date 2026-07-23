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
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'inStock', 'lowStock', 'outOfStock'

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
    const inStock = vehicles.filter((v) => (v.stock || 0) > 3).length;
    const lowStock = vehicles.filter((v) => (v.stock || 0) > 0 && (v.stock || 0) <= 3).length;
    const outOfStock = vehicles.filter((v) => (v.stock || 0) <= 0).length;

    return { totalVehicles, totalValuation, inStock, lowStock, outOfStock };
  }, [vehicles]);

  // Filtered Table List
  const filteredVehicles = useMemo(() => {
    let result = vehicles;

    // Apply Stock Filter tab
    if (stockFilter === 'inStock') {
      result = result.filter((v) => (v.stock || 0) > 3);
    } else if (stockFilter === 'lowStock') {
      result = result.filter((v) => (v.stock || 0) > 0 && (v.stock || 0) <= 3);
    } else if (stockFilter === 'outOfStock') {
      result = result.filter((v) => (v.stock || 0) <= 0);
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.make?.toLowerCase().includes(query) ||
          v.model?.toLowerCase().includes(query) ||
          v.year?.toString().includes(query)
      );
    }

    return result;
  }, [vehicles, searchQuery, stockFilter]);

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
      window.dispatchEvent(new CustomEvent('autosphere-notification', {
        detail: {
          id: Date.now().toString(),
          text: `Soft deleted ${vehicle.make} ${vehicle.model} from showroom`,
          time: 'Just now',
          type: 'delete'
        }
      }));
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Management Panel</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Real-time dealership inventory control, statistics, and CRUD actions
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          aria-label="Add new vehicle to inventory"
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md shadow-blue-500/10 border border-white/10 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Statistics Analytics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory</p>
            <h3 className="text-2xl font-black text-slate-950 mt-1">{stats.totalVehicles} Models</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600">
            <Car className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Valuation</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">{formatCurrency(stats.totalValuation)}</h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active In-Stock</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.inStock} Models</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
            <PackageCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Out of Stock</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{stats.outOfStock} Models</h3>
          </div>
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Admin Filter Sidebar + Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Floating Sidebar Filter */}
        <div className="lg:col-span-3 bg-white p-5 rounded-[24px] border border-slate-200/85 space-y-4 shadow-sm h-fit">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span>Filter Sidebar</span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => setStockFilter('all')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                stockFilter === 'all'
                  ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="h-3.5 w-3.5" /> All Inventory
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
                {vehicles.length}
              </span>
            </button>

            <button
              onClick={() => setStockFilter('inStock')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                stockFilter === 'inStock'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <PackageCheck className="h-3.5 w-3.5 text-emerald-500" /> In Stock
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-600 font-bold">
                {stats.inStock}
              </span>
            </button>

            <button
              onClick={() => setStockFilter('lowStock')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                stockFilter === 'lowStock'
                  ? 'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Low Stock
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-600 font-bold">
                {stats.lowStock}
              </span>
            </button>

            <button
              onClick={() => setStockFilter('outOfStock')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                stockFilter === 'outOfStock'
                  ? 'bg-rose-50 text-rose-600 border border-rose-100 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> Out of Stock
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-600 font-bold">
                {stats.outOfStock}
              </span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="lg:col-span-9 bg-white rounded-[24px] border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
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
                placeholder="Search table by model, brand, or year..."
                className="w-full pl-10 pr-4 py-2.5 premium-input rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>

            <button
              onClick={fetchVehicles}
              disabled={loading}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-blue-500' : ''}`} />
              <span>Reload Table</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700" aria-label="Vehicle Inventory Table">
              <caption className="sr-only">Inventory Management Table</caption>
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-4">Vehicle Model</th>
                  <th className="py-4 px-4">Year</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4">Specs</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium" aria-live="polite" aria-busy={loading}>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading inventory records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 flex items-center space-x-3">
                        <img
                          src={
                            vehicle.image ||
                            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=100'
                          }
                          alt={vehicle.model}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200 shadow-sm"
                        />
                        <div>
                          <div className="font-bold text-slate-900">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[180px]">
                            {vehicle.description || 'No description provided'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-bold">{vehicle.year}</td>

                      <td className="py-3.5 px-4 font-extrabold text-blue-600">
                        {formatCurrency(vehicle.price)}
                      </td>

                      <td className="py-3.5 px-4">
                        {vehicle.stock > 3 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {vehicle.stock} in stock
                          </span>
                        ) : vehicle.stock > 0 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                            {vehicle.stock} low stock
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                            Out of stock
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        <div>{vehicle.fuelType}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{vehicle.transmission}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleRestock(vehicle)}
                            aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
                            title="Restock Inventory"
                            className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <PackagePlus className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleEdit(vehicle)}
                            aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                            title="Edit Vehicle"
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:text-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(vehicle)}
                            disabled={deletingId === vehicle._id}
                            aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                            title="Delete Vehicle"
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 hover:text-rose-700 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
