import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';

const HomePlaceholder = () => (
  <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md">
    <h1 className="text-3xl font-extrabold text-white mb-2">Vehicle Inventory Dashboard</h1>
    <p className="text-slate-400">Welcome to AutoSphere. Explore premium cars in stock.</p>
  </div>
);

const LoginPlaceholder = () => (
  <div className="p-8 max-w-md mx-auto bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md">
    <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
    <p className="text-slate-400">Sign in to your AutoSphere account.</p>
  </div>
);

const RegisterPlaceholder = () => (
  <div className="p-8 max-w-md mx-auto bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md">
    <h1 className="text-2xl font-bold text-white mb-2">Register</h1>
    <p className="text-slate-400">Create a new AutoSphere account.</p>
  </div>
);

const AdminPlaceholder = () => (
  <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md">
    <h1 className="text-2xl font-bold text-indigo-400 mb-2">Admin Management Panel</h1>
    <p className="text-slate-400">Restricted Admin vehicle management dashboard.</p>
  </div>
);

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePlaceholder />} />
            <Route path="/login" element={<LoginPlaceholder />} />
            <Route path="/register" element={<RegisterPlaceholder />} />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminPlaceholder />
                </AdminRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
