import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
