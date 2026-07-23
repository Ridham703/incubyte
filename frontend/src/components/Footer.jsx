import { Link } from 'react-router-dom';
import { Car, Github, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export const Footer = () => {
  const { isAdmin } = useAuth();
  return (
    <footer className="relative z-10 bg-white border-t border-slate-200/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">AutoSphere</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm">
              AutoSphere is a next-generation luxury car dealership portal designed for modern inventory sync, statistics dashboards, and roles-based showroom catalog management.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200/60 transition-all shadow-sm"
                aria-label="GitHub Repository"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-4">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-850 uppercase tracking-widest">Showroom</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
                {!isAdmin && (
                  <li>
                    <Link to="/" className="hover:text-blue-600 transition-colors">Catalog Listings</Link>
                  </li>
                )}
                <li>
                  <Link to="/login" className="hover:text-blue-600 transition-colors">Client Portal</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-850 uppercase tracking-widest">Workspace</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
                <li>
                  <Link to="/admin" className="hover:text-blue-600 transition-colors">Admin Dashboard</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-600 transition-colors">Create Staff Account</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-850 uppercase tracking-widest">dealership info</h4>
            <ul className="space-y-3 text-xs text-slate-500 font-medium">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>100 Auto Drive, Innovation District, CA 90210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <a href="mailto:support@autosphere.com" className="hover:text-blue-600 transition-colors">support@autosphere.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <a href="tel:+18005550199" className="hover:text-blue-600 transition-colors">+1 (800) 555-0199</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} AutoSphere Car Dealership Inventory System. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>SSL Secured Panel Connection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
