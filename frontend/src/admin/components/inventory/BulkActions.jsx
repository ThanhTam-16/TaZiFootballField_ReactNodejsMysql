// ====== frontend/src/admin/components/inventory/BulkActions.jsx (OPTIMIZED) ======
import { useState } from 'react';

const BulkActions = ({ selectedCount, onBulkAction, onExport }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const bulkActions = [
    {
      id: 'delete',
      label: 'Xóa sản phẩm',
      icon: 'fas fa-trash',
      color: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
      confirm: true
    },
    {
      id: 'export',
      label: 'Xuất Excel',
      icon: 'fas fa-file-export',
      color: 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
      confirm: false
    },
    {
      id: 'print',
      label: 'In nhãn',
      icon: 'fas fa-print',
      color: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      confirm: false
    }
  ];

  const handleActionClick = (actionId) => {
    setShowDropdown(false);
    
    if (actionId === 'export') {
      onExport();
    } else {
      onBulkAction(actionId);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <i className="fas fa-layer-group text-blue-600 dark:text-blue-400 text-sm"></i>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Đã chọn {selectedCount} sản phẩm
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Chọn thao tác hàng loạt để áp dụng
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <button
            onClick={() => handleActionClick('export')}
            className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <i className="fas fa-file-export text-xs"></i>
            <span>Xuất Excel</span>
          </button>

          {/* Dropdown for more actions */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <i className="fas fa-ellipsis-h text-xs"></i>
              <span className="hidden sm:inline">Thao tác khác</span>
              <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'} text-xs`}></i>
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                ></div>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1">
                  {bulkActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action.id)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors duration-200 ${action.color}`}
                    >
                      <i className={`${action.icon} text-xs w-4`}></i>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile Export Button */}
          <button
            onClick={() => handleActionClick('export')}
            className="sm:hidden flex items-center space-x-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            title="Xuất Excel"
          >
            <i className="fas fa-file-export text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;