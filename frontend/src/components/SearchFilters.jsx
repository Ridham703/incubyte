import { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'CVT'];

export const SearchFilters = ({ filters, onFilterChange, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value, page: 1 });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.fuelType ||
      filters.transmission ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minYear ||
      filters.maxYear
  );

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
      {/* Top Main Search Bar & Quick Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Keyword Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search make or model (e.g. Tesla, Camry, Mustang)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleChange('search', '')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Toggle Advanced Filters Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            showAdvanced || hasActiveFilters
              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
              : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/80'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          )}
        </button>

        {/* Sort By Dropdown */}
        <div className="relative min-w-[140px]">
          <select
            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFilterChange({ ...filters, sortBy, sortOrder, page: 1 });
            }}
            className="w-full py-2.5 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Year: Newest</option>
            <option value="mileage-asc">Lowest Mileage</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Fuel Type
            </label>
            <select
              value={filters.fuelType || ''}
              onChange={(e) => handleChange('fuelType', e.target.value)}
              className="w-full py-2 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">All Fuel Types</option>
              {FUEL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Transmission
            </label>
            <select
              value={filters.transmission || ''}
              onChange={(e) => handleChange('transmission', e.target.value)}
              className="w-full py-2 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">All Transmissions</option>
              {TRANSMISSION_TYPES.map((trans) => (
                <option key={trans} value={trans}>
                  {trans}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Price Range ($)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="w-1/2 py-2 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="w-1/2 py-2 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Year Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Year"
                value={filters.minYear || ''}
                onChange={(e) => handleChange('minYear', e.target.value)}
                className="w-1/2 py-2 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <input
                type="number"
                placeholder="Max Year"
                value={filters.maxYear || ''}
                onChange={(e) => handleChange('maxYear', e.target.value)}
                className="w-1/2 py-2 px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Badges & Reset */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5 text-indigo-400" />
            <span>Active Filter Applied</span>
          </div>

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
