// ====== frontend/src/admin/components/common/DarkModeToggle.jsx ======
import { useState, useEffect } from 'react';

const DarkModeToggle = ({ className = '', size = 'default' }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('admin-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

  const updateTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    updateTheme(newDarkMode);
  };

  const sizeClasses = {
    small: 'w-10 h-6',
    default: 'w-12 h-7',
    large: 'w-14 h-8'
  };

  const toggleSizes = {
    small: 'w-4 h-4',
    default: 'w-5 h-5', 
    large: 'w-6 h-6'
  };

  const translateClasses = {
    small: isDark ? 'translate-x-4' : 'translate-x-1',
    default: isDark ? 'translate-x-5' : 'translate-x-1',
    large: isDark ? 'translate-x-6' : 'translate-x-1'
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center ${sizeClasses[size]} rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
      } ${className}`}
      title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
    >
      {/* Background with animated gradient */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-blue-400 to-blue-500'
      }`}></div>

      {/* Toggle circle */}
      <div
        className={`relative ${toggleSizes[size]} bg-white rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center ${translateClasses[size]}`}
      >
        {/* Icons */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Sun Icon */}
          <i 
            className={`fas fa-sun absolute text-yellow-500 transition-all duration-300 ${
              isDark ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'
            } ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'}`}
          ></i>
          
          {/* Moon Icon */}
          <i 
            className={`fas fa-moon absolute text-blue-600 transition-all duration-300 ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-50'
            } ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'}`}
          ></i>
        </div>
      </div>

      {/* Animated background stars for dark mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-2 right-1.5 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1.5 left-1 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-80" style={{ animationDelay: '1s' }}></div>
        </div>
      )}

      {/* Light mode rays */}
      {!isDark && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-0 left-1/2 w-0.5 h-1 bg-yellow-300 rounded-full transform -translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 w-0.5 h-1 bg-yellow-300 rounded-full transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute left-0 top-1/2 w-1 h-0.5 bg-yellow-300 rounded-full transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute right-0 top-1/2 w-1 h-0.5 bg-yellow-300 rounded-full transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
        </div>
      )}
    </button>
  );
};

// Compact version for mobile
export const CompactDarkModeToggle = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDark(shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ${className}`}
      title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
    >
      {isDark ? (
        <i className="fas fa-sun text-yellow-500"></i>
      ) : (
        <i className="fas fa-moon text-gray-600"></i>
      )}
    </button>
  );
};

export default DarkModeToggle;