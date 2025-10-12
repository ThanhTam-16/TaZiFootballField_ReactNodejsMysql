// ====== frontend/src/admin/components/AdminLayout.jsx (FIXED RESPONSIVE) ======
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import DarkModeToggle, { CompactDarkModeToggle } from './common/DarkModeToggle';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { admin, logout, hasPermission } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('adminSidebarCollapsed');
    if (stored) setSidebarCollapsed(JSON.parse(stored));
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
  };

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout();
      navigate('/');
    }
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      permission: null
    },
    {
      path: '/admin/bookings',
      icon: 'fas fa-clipboard-list',
      label: 'Đơn đặt sân',
      permission: 'bookings'
    },
    {
      path: '/admin/fields',
      icon: 'fas fa-calendar-alt',
      label: 'Quản lý sân',
      permission: 'fields'
    },
    {
      path: '/admin/users',
      icon: 'fas fa-users',
      label: 'Khách hàng',
      permission: 'users'
    },
    {
      path: '/admin/teams',
      icon: 'fas fa-handshake',
      label: 'Kèo & Ghép đội',
      permission: 'bookings'
    },
    {
      path: '/admin/inventory',
      icon: 'fas fa-boxes',
      label: 'Tồn kho',
      permission: 'inventory'
    },
    {
      path: '/admin/maintenance',
      icon: 'fas fa-tools',
      label: 'Bảo trì',
      permission: 'fields'
    },
    {
      path: '/admin/reports',
      icon: 'fas fa-chart-line',
      label: 'Báo cáo',
      permission: 'reports'
    }
  ].filter(item => !item.permission || hasPermission(item.permission));

  const getPageTitle = () => {
    const titles = {
      '/admin/dashboard': 'Dashboard',
      '/admin/bookings': 'Quản lý đặt sân',
      '/admin/fields': 'Quản lý sân',
      '/admin/users': 'Quản lý khách hàng',
      '/admin/teams': 'Quản lý Kèo & Ghép đội',
      '/admin/inventory': 'Quản lý tồn kho',
      '/admin/maintenance': 'Quản lý bảo trì',
      '/admin/reports': 'Báo cáo'
    };
    return titles[location.pathname] || 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center space-x-3 transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-futbol text-white text-sm"></i>
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                FootballField
              </span>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <i className="fas fa-chevron-left text-sm"></i>
            </button>
          )}
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                location.pathname === item.path
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <i className={`${item.icon} ${sidebarCollapsed ? 'text-base' : 'text-sm'} group-hover:scale-110 transition-transform duration-200`}></i>
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </a>
          ))}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Dark Mode Toggle */}
          <div className={`mb-4 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            <DarkModeToggle size={sidebarCollapsed ? 'small' : 'default'} />
          </div>
          
          {/* User Profile */}
          <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <i className="fas fa-user-shield text-white text-sm"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {admin?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                  {admin?.role?.replace('_', ' ')}
                </p>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`mt-3 w-full flex items-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 text-sm font-medium ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Đăng xuất' : ''}
          >
            <i className="fas fa-sign-out-alt"></i>
            {!sidebarCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
        
        {/* Expand/Collapse Button for collapsed state */}
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm"
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <i className="fas fa-bars"></i>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <i className="fas fa-futbol text-white text-xs"></i>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                FootballField
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CompactDarkModeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
        mobileNavOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
            mobileNavOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileNavOpen(false)}
        ></div>
        
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}>
          {/* Mobile Nav Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-futbol text-white text-sm"></i>
              </div>
              <span className="font-bold text-white text-lg">
                FootballField
              </span>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Mobile Nav Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto ">
            {menuItems.map((item, index) => (
              <a
                key={item.path}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setMobileNavOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: mobileNavOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none'
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  location.pathname === item.path
                    ? 'bg-white/20'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <i className={`${item.icon} text-sm ${
                    location.pathname === item.path ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}></i>
                </div>
                <span className="font-medium">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </a>
            ))}
          </nav>
          
          {/* Mobile Nav Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user-shield text-white"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {admin?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                  {admin?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              {/* <CompactDarkModeToggle className="w-full justify-center py-2" /> */}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-lg transform hover:scale-[1.02]"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - FIXED RESPONSIVE CONTAINER */}
      <main className={`min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Admin</span>
                <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {getPageTitle()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentTime.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentTime.toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - RESPONSIVE CONTAINER */}
        <div className="w-full">
          <div className="pt-16 lg:pt-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;