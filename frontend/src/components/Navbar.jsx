import React from 'react';
import { Car, Plus, Sparkles } from 'lucide-react';

const Navbar = ({ onAddClick, totalVehicles = 0 }) => {
  return (
    <header className="sticky top-0 z-30 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-cyan-400 p-0.5 shadow-glow">
              <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                <Car className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  AutoVault
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Pro Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Dealership Inventory Management System</p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Live Fleet: <strong className="text-white">{totalVehicles}</strong> Vehicles</span>
            </div>

            <button
              onClick={onAddClick}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-cyan-500 text-white font-medium text-sm hover:opacity-95 transition-all shadow-glow hover:shadow-cyan-glow active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
