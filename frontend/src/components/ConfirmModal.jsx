import { useEffect } from 'react';
import { useToast } from '../hooks/useToast';

function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận",
  message,
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  type = "info", // info, warning, danger, success
  isLoading = false
}) {
  const { showError } = useToast();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'fas fa-exclamation-circle',
          iconColor: 'text-red-400',
          button: 'bg-red-500 hover:bg-red-600 text-white',
          accent: 'text-red-600 dark:text-red-400'
        };
      case 'success':
        return {
          icon: 'fas fa-check-circle',
          iconColor: 'text-green-400',
          button: 'bg-green-500 hover:bg-green-600 text-white',
          accent: 'text-green-600 dark:text-green-400'
        };
      case 'warning':
        return {
          icon: 'fas fa-exclamation-triangle',
          iconColor: 'text-yellow-400',
          button: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          accent: 'text-yellow-600 dark:text-yellow-400'
        };
      default: // info
        return {
          icon: 'fas fa-info-circle',
          iconColor: 'text-blue-400',
          button: 'bg-blue-500 hover:bg-blue-600 text-white',
          accent: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  const styles = getTypeStyles();

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Confirm action error:', error);
      showError('Có lỗi xảy ra khi thực hiện hành động');
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm transform transition-all duration-200 scale-95 animate-scale-in border border-gray-200 dark:border-gray-600">
        
        {/* Content - Compact */}
        <div className="p-4">
          {/* Icon & Title */}
          <div className="flex items-center space-x-3 mb-3">
            <div className={`flex-shrink-0 ${styles.iconColor}`}>
              <i className={`${styles.icon} text-lg`}></i>
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${styles.accent}`}>
                {title}
              </h3>
              {message && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 ${styles.button} py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                  <span className="text-xs">Đang xử lý...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;