import { Car, ShieldCheck, Database, Layers, Sparkles, Activity, Search, Gauge } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-brand-indigo to-brand-cyan rounded-xl shadow-lg shadow-brand-indigo/30">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              DrivePulse <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">PRO</span>
            </h1>
            <p className="text-xs text-slate-400">Inventory System</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <a href="#dashboard" className="text-brand-cyan hover:text-white transition-colors flex items-center gap-1.5">
            <Activity className="w-4 h-4" /> Dashboard
          </a>
          <a href="#inventory" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Car className="w-4 h-4" /> Vehicles
          </a>
          <a href="#analytics" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Gauge className="w-4 h-4" /> Analytics
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all">
            Sign In
          </button>
          <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white shadow-md shadow-brand-indigo/20 hover:opacity-90 transition-all">
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl glass-panel p-8 md:p-12 border border-white/10 bg-gradient-to-r from-dark-800/80 to-brand-indigo/10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Dealership Management
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              DrivePulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-cyan">Inventory System</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Streamline vehicle tracking, real-time analytics, stock auditing, and sales workflows with production-grade TDD architecture.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search VIN, Make, Model, or Year..."
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-900/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 transition-all"
                />
              </div>
              <button className="px-6 py-2.5 bg-gradient-to-r from-brand-indigo to-brand-cyan rounded-xl text-sm font-semibold text-white shadow-lg shadow-brand-indigo/30 hover:shadow-brand-cyan/30 transition-all">
                Search Stock
              </button>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-brand-indigo/40 transition-all">
            <div className="p-3 w-fit bg-brand-indigo/20 text-brand-indigo rounded-xl border border-brand-indigo/30">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Repository Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decoupled data access layer with Mongoose & MongoDB Atlas for enterprise resilience.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-brand-cyan/40 transition-all">
            <div className="p-3 w-fit bg-brand-cyan/20 text-brand-cyan rounded-xl border border-brand-cyan/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Strict TDD Workflow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% verified test-driven development with Jest, Supertest, and React Testing Library.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-brand-indigo/40 transition-all">
            <div className="p-3 w-fit bg-brand-indigo/20 text-brand-indigo rounded-xl border border-brand-indigo/30">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Glassmorphism UI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sleek dark mode interface styled with Tailwind CSS, Framer Motion, and responsive layouts.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-panel mt-auto py-6 border-t border-white/10 text-center text-xs text-slate-500">
        <p>&copy; 2026 DrivePulse Inventory System. All rights reserved. Built with strict TDD.</p>
      </footer>
    </div>
  );
}
