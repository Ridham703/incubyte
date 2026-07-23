import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import VehicleCard from '../components/VehicleCard';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import { Car, RefreshCw, AlertCircle, Sparkles, TrendingUp, Compass, Award } from 'lucide-react';
import carOutline from '../hero_car_outline.png';

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
  const { isAdmin } = useAuth();
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
    if (!isAdmin) {
      fetchVehicles();
    }
  }, [fetchVehicles, isAdmin]);

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Premium Hero Banner (Light Mode Only) */}
      <div className="relative overflow-hidden bg-white border border-slate-200/80 p-8 sm:p-12 rounded-[32px] shadow-[0_10px_35px_rgba(0,0,0,0.02)]">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Luxury Car Outline Background */}
        <div 
          className="absolute right-0 bottom-0 top-0 w-full sm:w-[50%] bg-contain bg-right-bottom bg-no-repeat opacity-[0.06] pointer-events-none z-0" 
          style={{ backgroundImage: `url(${carOutline})` }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dealership Showroom</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Explore Available Vehicles
            </h1>
            <p className="text-slate-500 max-w-xl text-sm sm:text-base font-medium leading-relaxed">
              Discover and manage elite vehicles with top-tier specifications and complete pricing transparency.
            </p>
          </div>

          <button
            onClick={fetchVehicles}
            disabled={loading}
            aria-label="Refresh vehicle inventory"
            className="self-start md:self-auto flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Sync Catalog</span>
          </button>
        </div>
      </div>

      {/* Modern Dashboard Statistics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 p-6 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Showroom Range</span>
            <h3 className="text-2xl font-black text-slate-900">Elite Brands</h3>
          </div>
          <div className="p-3.5 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100 shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory Status</span>
            <h3 className="text-2xl font-black text-slate-900">Verified Quality</h3>
          </div>
          <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100 shadow-sm">
            <Award className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Real-Time Sync</span>
            <h3 className="text-2xl font-black text-slate-900">Active Listings</h3>
          </div>
          <div className="p-3.5 bg-cyan-50 rounded-2xl text-cyan-600 border border-cyan-100 shadow-sm">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Loading Skeletons */}
      {loading && (
        <div
          aria-live="polite"
          aria-busy="true"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 animate-pulse overflow-hidden relative"
            >
              <div className="aspect-[16/10] bg-slate-100 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                <div className="h-6 bg-slate-100 rounded-lg w-2/3" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-9 bg-slate-100 rounded-xl" />
                <div className="h-9 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Card */}
      {!loading && error && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-8 bg-white rounded-3xl border border-rose-200 text-center space-y-4 max-w-lg mx-auto shadow-lg"
        >
          <div className="inline-flex p-3 bg-rose-50 rounded-2xl text-rose-600 border border-rose-100 shadow-sm">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Failed to Fetch Inventory</h3>
          <p className="text-sm text-rose-600 font-medium">{error}</p>
          <button
            onClick={fetchVehicles}
            className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State Showcase */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="p-12 bg-white rounded-[32px] border border-slate-200/80 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="inline-flex p-4 bg-slate-50 rounded-2xl text-slate-500 border border-slate-100 shadow-sm">
            <Car className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">No Vehicles Found</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            We could not find any vehicle matching your specific filtering parameters. Try resetting details.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Clear Search Filters
          </button>
        </div>
      )}

      {/* Success Listing Layout */}
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
