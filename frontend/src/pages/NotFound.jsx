import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-center">
        <div className="inline-flex p-4 bg-indigo-50 rounded-2xl text-indigo-650 border border-indigo-100 shadow-sm">
          <ShieldAlert className="h-12 w-12" />
        </div>
        
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          The page or vehicle resource you are looking for does not exist or has been moved.
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-white/10 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[46px]"
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
