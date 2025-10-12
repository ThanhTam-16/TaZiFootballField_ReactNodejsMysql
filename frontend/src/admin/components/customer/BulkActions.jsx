// ====== frontend/src/admin/components/customer/BulkActions.jsx (TAILWIND VERSION) ======
const BulkActions = ({ selectedCount, onBulkAction, onExport }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-slide-down">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Selection Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <i className="fas fa-check-square text-blue-600 dark:text-blue-400 text-sm"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Đã chọn {selectedCount} khách hàng
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Chọn thao tác để áp dụng cho tất cả
            </p>
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onBulkAction('activate')}
            className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <i className="fas fa-check text-xs mr-2"></i>
            <span>Kích hoạt</span>
          </button>

          <button
            onClick={() => onBulkAction('deactivate')}
            className="inline-flex items-center px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <i className="fas fa-ban text-xs mr-2"></i>
            <span>Vô hiệu hóa</span>
          </button>

          <button
            onClick={onExport}
            className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <i className="fas fa-download text-xs mr-2"></i>
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => onBulkAction('delete')}
            className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <i className="fas fa-trash text-xs mr-2"></i>
            <span>Xóa</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Animation */}
      <div className="mt-3 h-1 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min((selectedCount / 20) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BulkActions;