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
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4 transition-all duration-200">
      {/* Top Main Search Bar & Quick Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Keyword Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            aria-label="Search vehicle make or model"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search make or model (e.g. Tesla, Camry, Mustang)..."
            className="w-full pl-11 pr-10 py-3 premium-input rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleChange('search', '')}
              aria-label="Clear search input"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-800 focus:outline-none rounded-xl"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Toggle Advanced Filters Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-label={showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'}
          aria-expanded={showAdvanced}
          className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl border text-sm font-bold transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            showAdvanced || hasActiveFilters
              ? 'bg-blue-50/80 text-blue-600 border-blue-200 shadow-sm'
              : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100/80'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
        </button>

        {/* Sort By Dropdown */}
        <div className="relative min-w-[150px]">
          <select
            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFilterChange({ ...filters, sortBy, sortOrder, page: 1 });
            }}
            className="w-full py-3 px-4 premium-input rounded-2xl text-slate-800 text-sm focus:outline-none"
          >
            <option value="createdAt-desc" className="bg-white text-slate-800">Newest First</option>
            <option value="price-asc" className="bg-white text-slate-800">Price: Low to High</option>
            <option value="price-desc" className="bg-white text-slate-800">Price: High to Low</option>
            <option value="year-desc" className="bg-white text-slate-800">Year: Newest</option>
            <option value="mileage-asc" className="bg-white text-slate-800">Lowest Mileage</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Fuel Type
            </label>
            <select
              value={filters.fuelType || ''}
              onChange={(e) => handleChange('fuelType', e.target.value)}
              className="w-full py-2.5 px-3.5 premium-input rounded-xl text-slate-800 text-sm focus:outline-none"
            >
              <option value="" className="bg-white text-slate-800">All Fuel Types</option>
              {FUEL_TYPES.map((type) => (
                <option key={type} value={type} className="bg-white text-slate-800">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Transmission
            </label>
            <select
              value={filters.transmission || ''}
              onChange={(e) => handleChange('transmission', e.target.value)}
              className="w-full py-2.5 px-3.5 premium-input rounded-xl text-slate-800 text-sm focus:outline-none"
            >
              <option value="" className="bg-white text-slate-800">All Transmissions</option>
              {TRANSMISSION_TYPES.map((trans) => (
                <option key={trans} value={trans} className="bg-white text-slate-800">
                  {trans}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Price Range ($)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="w-1/2 py-2.5 px-3.5 premium-input rounded-xl text-slate-800 text-sm focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="w-1/2 py-2.5 px-3.5 premium-input rounded-xl text-slate-800 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Year Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Year"
                value={filters.minYear || ''}
                onChange={(e) => handleChange('minYear', e.target.value)}
                className="w-1/2 py-2.5 px-3.5 premium-input rounded-xl text-slate-800 text-sm focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max Year"
                value={filters.maxYear || ''}
                onChange={(e) => handleChange('maxYear', e.target.value)}
                className="w-1/2 py-2.5 px-3.5 premium-input rounded-xl text-slate-800 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Badges & Reset */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-600 font-bold">
            <Filter className="h-3.5 w-3.5 text-blue-500" />
            <span>Active Filter Applied</span>
          </div>

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 text-xs text-blue-600 hover:text-blue-700 font-extrabold px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100/80 transition-all shadow-sm"
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
