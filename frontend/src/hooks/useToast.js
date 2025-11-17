// ====== frontend/src/hooks/useToast.js (CUSTOMER TOAST) ======
import { useCallback } from 'react';

export const useToast = () => {
  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    // Remove existing toasts of the same type
    const existingToasts = document.querySelectorAll(`.customer-toast-${type}`);
    existingToasts.forEach(toast => toast.remove());

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('customer-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'customer-toast-container';
      toastContainer.className = 'fixed top-4 right-4 z-[100] space-y-2';
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `customer-toast-${type} transform transition-all duration-500 ease-out translate-x-full opacity-0`;
    
    // Toast styling based on type (customer-friendly colors)
    const styles = {
      success: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        icon: 'fas fa-check-circle text-green-500',
        progress: 'bg-green-500'
      },
      error: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        icon: 'fas fa-exclamation-circle text-red-500',
        progress: 'bg-red-500'
      },
      warning: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-800 dark:text-yellow-200',
        icon: 'fas fa-exclamation-triangle text-yellow-500',
        progress: 'bg-yellow-500'
      },
      info: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        icon: 'fas fa-info-circle text-blue-500',
        progress: 'bg-blue-500'
      }
    };

    const style = styles[type] || styles.info;

    toast.innerHTML = `
      <div class="relative ${style.bg} ${style.border} border rounded-xl shadow-lg backdrop-blur-sm max-w-sm w-full p-4 group hover:shadow-xl transition-shadow duration-300 ">
        <!-- Close button -->
        <button 
          onclick="this.closest('.customer-toast-${type}').remove()" 
          class="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
        
        <!-- Content -->
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 mt-0.5">
            <i class="${style.icon} text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="${style.text} text-sm font-medium leading-5">
              ${message}
            </p>
          </div>
        </div>
        
        <!-- Progress bar -->
        <div class="absolute bottom-0 left-0 h-1 ${style.progress} rounded-bl-xl transition-all duration-${duration} ease-linear" style="width: 100%; animation: customer-toast-progress ${duration}ms linear forwards;"></div>
      </div>
    `;

    // Add CSS animation for progress bar if not exists
    if (!document.head.querySelector('#customer-toast-animations')) {
      const style = document.createElement('style');
      style.id = 'customer-toast-animations';
      style.textContent = `
        @keyframes customer-toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes customer-slideInRight {
          from { 
            transform: translateX(100%); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
        
        @keyframes customer-slideOutRight {
          from { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
          to { 
            transform: translateX(100%) scale(0.95); 
            opacity: 0; 
          }
        }
        
        .customer-toast-enter {
          animation: customer-slideInRight 0.5s ease-out forwards;
        }
        
        .customer-toast-exit {
          animation: customer-slideOutRight 0.3s ease-in forwards;
        }
      `;
      document.head.appendChild(style);
    }

    // Add toast to container
    toastContainer.appendChild(toast);

    // Trigger enter animation
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100', 'customer-toast-enter');
    }, 100);

    // Auto remove after duration
    const autoRemoveTimer = setTimeout(() => {
      removeToast(toast);
    }, duration);

    // Add click to dismiss
    toast.addEventListener('click', () => {
      clearTimeout(autoRemoveTimer);
      removeToast(toast);
    });

    // Function to remove toast with animation
    function removeToast(toastElement) {
      toastElement.classList.add('customer-toast-exit');
      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }
        
        // Remove container if empty
        const container = document.getElementById('customer-toast-container');
        if (container && container.children.length === 0) {
          container.remove();
        }
      }, 300);
    }

    return toast;
  }, []);

  // Utility methods for different toast types
  const showSuccess = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  // Clear all toasts
  const clearAllToasts = useCallback(() => {
    const container = document.getElementById('customer-toast-container');
    if (container) {
      container.remove();
    }
  }, []);

  return { 
    showToast, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo,
    clearAllToasts 
  };
};

export default useToast;