import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import bgImage from '../premium_ambient_bg.png';

export const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-blue-600 selection:text-white overflow-hidden transition-colors duration-200">
      {/* Premium subtle light background orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] bg-gradient-to-tl from-cyan-400/8 via-blue-500/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      
      {/* Premium Grid Pattern Background overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      
      {/* Premium ambient background image cover */}
      <div 
        className="fixed inset-0 bg-cover bg-center pointer-events-none opacity-[0.08] z-0" 
        style={{ backgroundImage: `url(${bgImage})` }} 
      />
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
            borderRadius: '16px',
            padding: '12px 18px',
            fontSize: '14px',
            fontWeight: '600',
          },
        }}
      />
      <Navbar />
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
