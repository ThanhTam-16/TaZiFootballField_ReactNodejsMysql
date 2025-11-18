// frontend/src/components/LoadingScreen.jsx
import { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';

function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500">
      {/* Logo Container */}
      <div className="relative mb-8">
        {/* Logo với transparent background */}
        <div className="relative z-10">
          <img 
            src={logo} 
            alt="TaZi Football Fields" 
            className="h-20 w-auto drop-shadow-lg"
          />
        </div>
        
        {/* Hiệu ứng ring xung quanh logo */}
        <div className="absolute inset-0 border-4 border-green-300/40 rounded-full animate-ping -m-3"></div>
        <div className="absolute inset-0 border-2 border-green-200/30 rounded-full animate-pulse -m-2"></div>
        
        {/* Glow effect nhẹ */}
        <div className="absolute inset-0 bg-green-400/10 rounded-full blur-xl -m-4 animate-pulse"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center mb-6">
        <p className="text-green-600 dark:text-green-300 text-sm font-medium bg-white/30 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
          Đang khởi tạo hệ thống...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 bg-green-200/50 dark:bg-green-800/50 rounded-full h-2 overflow-hidden shadow-inner backdrop-blur-sm">
        <div 
          className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-2 mt-6">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-bounce shadow-sm"
            style={{ animationDelay: `${dot * 0.2}s` }}
          ></div>
        ))}
      </div>

      {/* Tagline */}
      <div className="absolute bottom-8">
        <p className="text-xs text-green-600 dark:text-green-300 bg-white/30 dark:bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
          Sân bóng chất lượng - Đam mê trọn vẹn
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;