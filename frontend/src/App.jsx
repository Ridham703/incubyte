import React from "react";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="glass-card p-8 rounded-2xl max-w-lg w-full text-center space-y-4 border border-slate-800">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600/20 text-cyan-400 mb-2 border border-cyan-500/30">
          🏎️
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
          Incubyte Car Dealership
        </h1>
        <p className="text-slate-400 text-sm">
          Production-Ready Inventory Management System
        </p>
        <div className="pt-4 border-t border-slate-800/80 flex justify-center gap-2 text-xs text-slate-500">
          <span className="px-3 py-1 rounded-full bg-slate-800/80 text-cyan-300 border border-slate-700">
            TDD Architecture
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800/80 text-indigo-300 border border-slate-700">
            Glassmorphic UI
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
