// ====== frontend/src/admin/components/customer/BulkActions.jsx (OPTIMIZED)
const BulkActions = ({ selectedCount, onBulkAction, onExport }) => {
  const actions = [
    {
      label: 'Kích hoạt',
      action: 'activate',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      icon: 'fas fa-check'
    },
    {
      label: 'Vô hiệu hóa',
      action: 'deactivate',
      color: 'bg-amber-600 hover:bg-amber-700',
      icon: 'fas fa-ban'
    },
    {
      label: 'Xuất Excel',
      action: 'export',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: 'fas fa-download',
      customAction: onExport
    },
    {
      label: 'Xóa',
      action: 'delete',
      color: 'bg-red-600 hover:bg-red-700',
      icon: 'fas fa-trash'
    }
  ];

  const handleAction = (action) => {
    if (action.customAction) {
      action.customAction();
    } else {
      onBulkAction(action.action);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <i className="fas fa-layer-group text-white text-xs"></i>
          </div>
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Đã chọn {selectedCount} khách hàng
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action)}
              className={`px-3 py-1.5 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center space-x-1 ${action.color}`}
            >
              <i className={`${action.icon} text-xs`}></i>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkActions;