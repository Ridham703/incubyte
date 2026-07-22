import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-slate-900/70 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl text-center">
        <div className="inline-flex p-4 bg-indigo-500/10 rounded-full text-indigo-400 border border-indigo-500/20">
          <ShieldAlert className="h-12 w-12" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The page or vehicle resource you are looking for does not exist or has been moved.
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Inventory Showroom</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
