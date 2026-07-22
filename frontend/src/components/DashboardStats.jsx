import React from 'react';
import { Car, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardStats = ({ stats }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const statCards = [
    {
      title: 'Total Fleet Inventory',
      value: stats?.totalVehicles || 0,
      subtext: 'Vehicles cataloged',
      icon: Car,
      gradient: 'from-indigo-500/20 via-indigo-600/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      iconBg: 'bg-indigo-500/20 text-indigo-400',
    },
    {
      title: 'Available On Lot',
      value: stats?.availableVehicles || 0,
      subtext: 'Ready for sale',
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      title: 'Total Inventory Value',
      value: formatCurrency(stats?.totalInventoryValuation),
      subtext: 'Combined asset value',
      icon: DollarSign,
      gradient: 'from-cyan-500/20 via-cyan-600/10 to-transparent',
      borderColor: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
    },
    {
      title: 'Average Fleet Price',
      value: formatCurrency(stats?.averageVehiclePrice),
      subtext: 'Per unit average',
      icon: TrendingUp,
      gradient: 'from-purple-500/20 via-purple-600/10 to-transparent',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className={`relative overflow-hidden rounded-2xl glass-card border ${card.borderColor} p-5 transition-all duration-300 hover:translate-y-[-2px]`}
          >
            {/* Background Radial Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 pointer-events-none`} />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {card.subtext}
                </p>
              </div>
              <div className={`p-3.5 rounded-xl ${card.iconBg} shadow-inner`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
