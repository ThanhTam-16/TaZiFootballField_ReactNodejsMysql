// ====== frontend/src/admin/components/booking/BulkActions.jsx (OPTIMIZED) ======
const BulkActions = ({ selectedCount, onBulkAction }) => {
  const actions = [
    {
      label: 'Duyệt đã chọn',
      action: 'approved',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      icon: 'fas fa-check'
    },
    {
      label: 'Từ chối đã chọn',
      action: 'cancelled',
      color: 'bg-red-600 hover:bg-red-700',
      icon: 'fas fa-times'
    },
    {
      label: 'Hoàn thành đã chọn',
      action: 'completed',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: 'fas fa-flag-checkered'
    },
    {
      label: 'Xóa đã chọn',
      action: 'delete',
      color: 'bg-gray-600 hover:bg-gray-700',
      icon: 'fas fa-trash'
    }
  ];

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <i className="fas fa-layer-group text-white text-xs"></i>
          </div>
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Đã chọn {selectedCount} đơn
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => onBulkAction(action.action)}
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