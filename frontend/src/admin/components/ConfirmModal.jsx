// ====== frontend/src/admin/components/common/ConfirmModal.jsx (TAILWIND VERSION) ======
const ConfirmModal = ({ 
  message, 
  onConfirm, 
  onCancel, 
  title = "Xác nhận", 
  type = "warning",
  confirmText = "Xác nhận",
  cancelText = "Hủy"
}) => {
  const getTypeConfig = () => {
    const configs = {
      warning: {
        icon: 'fas fa-exclamation-triangle',
        iconBg: 'bg-amber-100 dark:bg-amber-900/20',
        iconColor: 'text-amber-600 dark:text-amber-400',
        confirmBg: 'bg-amber-600 hover:bg-amber-700',
        titleColor: 'text-amber-900 dark:text-amber-100'
      },
      danger: {
        icon: 'fas fa-exclamation-circle',
        iconBg: 'bg-red-100 dark:bg-red-900/20',
        iconColor: 'text-red-600 dark:text-red-400',
        confirmBg: 'bg-red-600 hover:bg-red-700',
        titleColor: 'text-red-900 dark:text-red-100'
      },
      info: {
        icon: 'fas fa-info-circle',
        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        confirmBg: 'bg-blue-600 hover:bg-blue-700',
        titleColor: 'text-blue-900 dark:text-blue-100'
      },
      success: {
        icon: 'fas fa-check-circle',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/20',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        confirmBg: 'bg-emerald-600 hover:bg-emerald-700',
        titleColor: 'text-emerald-900 dark:text-emerald-100'
      }
    };
    return configs[type] || configs.warning;
  };

  const config = getTypeConfig();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-modal-enter">
        {/* Content */}
        <div className="px-6 py-6 text-center">
          {/* Icon */}
          <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <i className={`${config.icon} ${config.iconColor} text-2xl`}></i>
          </div>

          {/* Title */}
          <h3 className={`text-lg font-semibold ${config.titleColor} mb-3`}>
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-sm font-medium text-white ${config.confirmBg} rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;