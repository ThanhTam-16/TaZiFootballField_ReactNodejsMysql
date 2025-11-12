import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/images/logo.png';
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const openLogin = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: 'fas fa-home' },
    { path: '/booking', label: 'Đặt sân', icon: 'fas fa-calendar-plus' },
    { path: '/find-match', label: 'Tìm kèo', icon: 'fas fa-users' },
    { path: '/join-team', label: 'Ghép đội', icon: 'fas fa-user-friends' },
    { path: '/contact', label: 'Liên hệ', icon: 'fas fa-envelope' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-12 md:h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="w-6 h-6 md:w-10 md:h-10  rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <img src={logo} alt="logo" className='w-full h-full object-cover' />
                  </div>
                </div>
                <span className="text-base md:text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  TaZiFootball
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 flex items-center space-x-1 md:space-x-2 group ${
                    isActive(item.path)
                      ? 'bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                >
                  <i className={`${item.icon} text-xs transition-transform group-hover:scale-110`}></i>
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="hidden xl:flex items-center space-x-1 md:space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-300"
                title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
              >
                <i className={`fas ${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-gray-600 dark:text-gray-300'} text-xs md:text-sm`}></i>
              </button>

              {user ? (
                <div className="flex items-center space-x-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 group"
                  >
                    <div className="w-5 h-5 md:w-7 md:h-7 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-white text-xs"></i>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 hidden lg:block">
                      {user.name?.length > 10 ? user.name.substring(0, 10) + '...' : user.name || 'User'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 p-1"
                    title="Đăng xuất"
                  >
                    <i className="fas fa-sign-out-alt text-xs"></i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={openLogin}
                  className="px-3 md:px-4 py-1.5 md:py-2 gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-1 text-xs md:text-sm"
                >
                  <i className="fas fa-user"></i>
                  <span className="hidden md:inline">Đăng nhập</span>
                </button>
              )}
            </div>

            {/* Mobile menu button và User info */}
            <div className="xl:hidden flex items-center space-x-2">
              {/* Mobile User Info */}
              {user && (
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-white text-xs"></i>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[60px] truncate">
                    {user.name || 'User'}
                  </span>
                </Link>
              )}

              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-300"
                title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
              >
                <i className={`fas ${isDark ? 'fa-sun text-yellow-500' : 'fa-moon text-gray-600'} text-xs`}></i>
              </button>

              <button
                onClick={toggleMenu}
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-300"
              >
                <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-gray-700 dark:text-gray-300 text-xs`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`xl:hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50`}>
          <div className="px-3 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-l-4 border-green-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                <i className={`${item.icon} w-4 text-center text-sm`}></i>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
            
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
              {!user && (
                <button
                  onClick={openLogin}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium w-full hover:shadow-lg transition-all duration-300"
                >
                  <i className="fas fa-user w-4 text-center text-sm"></i>
                  <span className="text-sm">Đăng nhập</span>
                </button>
              )}

              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                >
                  <i className="fas fa-sign-out-alt w-4 text-center text-sm"></i>
                  <span className="font-medium text-sm">Đăng xuất</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer để tránh content bị che */}
      <div className="h-12 md:h-16"></div>
    </>
  );
}

export default Header;