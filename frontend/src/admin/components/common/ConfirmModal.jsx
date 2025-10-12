// ====== 4. CREATE: frontend/src/admin/components/common/ConfirmModal.jsx ======
const ConfirmModal = ({ message, onConfirm, onCancel, title = "Xác nhận" }) => {
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
        <div className="admin-confirm-actions flex justify-center space-x-3">
          <button
            onClick={onCancel}
            className="admin-btn admin-btn-secondary px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="admin-btn admin-btn-primary px-4 py-2 rounded bg-blue-600 text-white"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;