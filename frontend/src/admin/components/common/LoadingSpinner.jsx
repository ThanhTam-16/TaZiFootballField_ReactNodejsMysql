// ====== frontend/src/admin/components/common/LoadingSpinner.jsx (TAILWIND) ======
const LoadingSpinner = ({ 
  message = 'Đang tải...', 
  size = 'default',
  variant = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const variants = {
    default: 'border-gray-300 border-t-blue-600',
    primary: 'border-gray-300 border-t-emerald-600',
    white: 'border-gray-600 border-t-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Main Spinner */}
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-2 ${variants[variant]} rounded-full animate-spin`}
        ></div>
        
        {/* Inner dot for enhanced visual */}
        {size !== 'small' && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            size === 'large' ? 'w-2 h-2' : 'w-1.5 h-1.5'
          } bg-current rounded-full opacity-75 animate-pulse`}></div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
          
          {/* Animated dots */}
          <div className="flex space-x-1 justify-center mt-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline Loading Spinner for buttons
export const InlineSpinner = ({ size = 'small', className = '' }) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    default: 'w-4 h-4'
  };

  return (
    <div 
      className={`${sizeClasses[size]} border border-current border-t-transparent rounded-full animate-spin ${className}`}
    ></div>
  );
};

// Page Loading Overlay
export const PageLoadingOverlay = ({ message = 'Đang tải trang...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <LoadingSpinner message={message} size="large" variant="primary" />
      </div>
    </div>
  );
};

// Skeleton Loading for cards
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading for table rows
export const SkeletonTableRow = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </td>
    </tr>
  );
};

export default LoadingSpinner;