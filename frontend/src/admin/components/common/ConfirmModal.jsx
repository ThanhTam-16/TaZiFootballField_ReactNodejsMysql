// ====== 4. CREATE: frontend/src/admin/components/common/ConfirmModal.jsx ======
const ConfirmModal = ({ message, onConfirm, onCancel, title = "Xác nhận", confirmText = "Xác nhận", cancelText = "Hủy", config = { confirmBg: "bg-blue-600" } }) => {
  return (
    <div
      className="admin-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onCancel}
    >
      <div
        className="admin-confirm-modal bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-confirm-icon flex justify-center mb-3">
          <i className="fas fa-question-circle text-3xl text-blue-500"></i>
        </div>
        <h3 className="admin-confirm-title text-lg font-bold text-center mb-2" style={{color: 'blue'}}>
          {title}
        </h3>
        <p className="admin-confirm-message text-center text-gray-700 dark:text-gray-300 mb-4">
          {message}
        </p>
        <div className="admin-confirm-actions flex flex-col sm:flex-row gap-3 sm:gap-3">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onCancel && onCancel(); }}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onConfirm && onConfirm(); }}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white ${config.confirmBg} rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;