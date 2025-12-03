import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './admin/context/AdminContext';

// Customer Pages
import Home from './pages/Home';
import Booking from './pages/Booking';
import UserProfile from './pages/UserProfile';
import FindMatch from './pages/FindMatch';
import JoinTeam from './pages/JoinTeam';
import Contact from './pages/Contact';

// Admin Components
import AdminLogin from './admin/components/AdminLogin';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminFieldManagement from './admin/pages/AdminFieldManagement';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import AdminBookingManagement from './admin/pages/AdminBookingManagement';
import AdminCustomerManagement from './admin/pages/AdminCustomerManagement';
import AdminInventoryManagement from './admin/pages/AdminInventoryManagement';
import AdminMaintenanceManagement from './admin/pages/AdminMaintenanceManagement';
import AdminTeamManagement from './admin/pages/AdminTeamManagement';

// Shared 
import ToastProvider from './components/ToastProvider';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen'; 

// Styles
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [isLoading, setIsLoading] = useState(true); 

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const initializeDarkMode = () => {
      const savedTheme = localStorage.getItem('admin-theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    initializeDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('admin-theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
    {isLoading && <LoadingScreen /> }

    <Router>
      <ToastProvider>
      <AuthProvider>
        <AdminProvider>
          <ScrollToTop />
          <Routes>
            {/* ===== CUSTOMER ROUTES ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/find-match" element={<FindMatch />} />
            <Route path="/join-team" element={<JoinTeam />} />
            <Route path="/contact" element={<Contact />} />

            {/* ===== ADMIN ROUTES ===== */}
            {/* Admin Login - Không cần bảo vệ */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes với Layout */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              {/* Dashboard - Tất cả admin đều có quyền truy cập */}
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* Booking Management - Cần quyền 'bookings' */}
              <Route path="bookings" element={
                <ProtectedAdminRoute permission="bookings">
                  <AdminBookingManagement />
                </ProtectedAdminRoute>
              } />
              
              {/* Field Management - Cần quyền 'fields' */}
              <Route path="fields" element={
                <ProtectedAdminRoute permission="fields">
                  <AdminFieldManagement />
                </ProtectedAdminRoute>
              } />
              
              {/* User Management - Cần quyền 'users' */}
              <Route path="users" element={
                <ProtectedAdminRoute permission="users">
                  <AdminCustomerManagement />
                </ProtectedAdminRoute>
              } />

              {/* Inventory Management - Cần quyền 'inventory' */}
              <Route path="inventory" element={
                <ProtectedAdminRoute permission="inventory">
                  <AdminInventoryManagement />
                </ProtectedAdminRoute>
              } />

              {/* Maintenance Management - Cần quyền 'fields' */}
              <Route path="maintenance" element={
                <ProtectedAdminRoute permission="fields">
                  <AdminMaintenanceManagement />
                </ProtectedAdminRoute>
              } />

              {/* Team Management - Cần quyền 'bookings' */}
              <Route path="teams" element={
                <ProtectedAdminRoute permission="bookings">
                  <AdminTeamManagement />
                </ProtectedAdminRoute>
              } />
              

              {/* Default redirect to dashboard */}
              <Route index element={<AdminDashboard />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    404
                  </h1>
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Trang không tồn tại
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="/"
                      className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <i className="fas fa-home mr-2"></i>
                      Về trang chủ
                    </a>
                    <button
                      onClick={() => window.history.back()}
                      className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Quay lại trang trước
                    </button>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </AdminProvider>
      </AuthProvider>
      </ToastProvider>
    </Router>
    </>
  );
}

export default App;