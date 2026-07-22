import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value, page: 1 });
  };

  return (
    <div className="glass-card rounded-2xl p-5 mb-8 border border-slate-800 shadow-glass">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Make, Model, VIN, or Color..."
            value={filters.query || ''}
            onChange={(e) => handleChange('query', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Status Filter */}
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="glass-input px-3 py-2.5 rounded-xl text-sm bg-dark-bg text-slate-200 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Reserved">Reserved</option>
            <option value="In Maintenance">In Maintenance</option>
          </select>

          {/* Fuel Type Filter */}
          <select
            value={filters.fuelType || ''}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="glass-input px-3 py-2.5 rounded-xl text-sm bg-dark-bg text-slate-200 cursor-pointer"
          >
            <option value="">All Fuel Types</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Plug-in Hybrid">Plug-in Hybrid</option>
          </select>

          {/* Body Type Filter */}
          <select
            value={filters.bodyType || ''}
            onChange={(e) => handleChange('bodyType', e.target.value)}
            className="glass-input px-3 py-2.5 rounded-xl text-sm bg-dark-bg text-slate-200 cursor-pointer"
          >
            <option value="">All Body Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Convertible">Convertible</option>
            <option value="Wagon">Wagon</option>
            <option value="Van">Van</option>
          </select>

          {/* Sort Option */}
          <select
            value={filters.sort || '-createdAt'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="glass-input px-3 py-2.5 rounded-xl text-sm bg-dark-bg text-slate-200 cursor-pointer font-medium text-cyan-300"
          >
            <option value="-createdAt">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Year: Newest</option>
            <option value="mileage_asc">Lowest Mileage</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-sm font-medium transition border border-slate-700/50"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
