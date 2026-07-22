import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1 border-slate-700',
          },
        }}
      />
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} AutoSphere Car Dealership Inventory System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
