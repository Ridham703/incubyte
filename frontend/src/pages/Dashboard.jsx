import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import VehicleCard from '../components/VehicleCard';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import { Car, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

const INITIAL_FILTERS = {
  search: '',
  fuelType: '',
  transmission: '',
  minPrice: '',
  maxPrice: '',
  minYear: '',
  maxYear: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 8,
};

export const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== '' && val !== null && val !== undefined) {
          cleanParams[key] = val;
        }
      });

      const res = await api.get('/vehicles', { params: cleanParams });
      const data = res.data?.data;
      setVehicles(data?.vehicles || []);
      if (data?.pagination) {
        setPaginationMeta(data.pagination);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load vehicle inventory. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-8 rounded-3xl border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live Inventory Showroom</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Available Vehicles
            </h1>
            <p className="mt-2 text-slate-400 max-w-xl text-sm leading-relaxed">
              Search, filter, and discover our dealership collection of premium cars.
            </p>
          </div>

          <button
            onClick={fetchVehicles}
            disabled={loading}
            className="self-start md:self-auto flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refresh Stock</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Loading State Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/10] bg-slate-800/80 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-800/80 rounded w-1/3" />
                <div className="h-6 bg-slate-800/80 rounded w-2/3" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-8 bg-slate-800/80 rounded-lg" />
                <div className="h-8 bg-slate-800/80 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State Banner */}
      {!loading && error && (
        <div className="p-8 bg-red-950/30 border border-red-800/50 rounded-2xl text-center space-y-4 max-w-lg mx-auto backdrop-blur-md">
          <div className="inline-flex p-3 bg-red-900/40 rounded-full text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Failed to Fetch Inventory</h3>
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={fetchVehicles}
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-red-600/20"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-3xl text-center space-y-4 max-w-md mx-auto backdrop-blur-md">
          <div className="inline-flex p-4 bg-slate-800/80 rounded-full text-slate-400">
            <Car className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-white">No Vehicles Found</h3>
          <p className="text-sm text-slate-400">
            No vehicle match your current search or filter criteria. Try adjusting your parameters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Vehicle Grid Success State */}
      {!loading && !error && vehicles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onVehicleUpdate={(updated) => {
                  setVehicles((prev) =>
                    prev.map((v) => (v._id === updated._id ? updated : v))
                  );
                }}
              />
            ))}
          </div>

          {/* Pagination Navigation Controls */}
          <Pagination
            page={paginationMeta.page}
            totalPages={paginationMeta.totalPages}
            totalItems={paginationMeta.totalItems}
            limit={paginationMeta.limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
