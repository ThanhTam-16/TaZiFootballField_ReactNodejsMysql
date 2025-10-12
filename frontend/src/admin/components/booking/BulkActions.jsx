// ====== frontend/src/admin/components/booking/BulkActions.jsx (TAILWIND) ======
const BulkActions = ({ selectedCount, onBulkAction }) => {
  if (selectedCount === 0) return null;

  const actions = [
    {
      key: 'approved',
      label: 'Duyệt tất cả',
      icon: 'fas fa-check',
      color: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      textColor: 'text-white'
    },
    {
      key: 'cancelled',
      label: 'Từ chối tất cả',
      icon: 'fas fa-times',
      color: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      textColor: 'text-white'
    },
    {
      key: 'completed',
      label: 'Hoàn thành tất cả',
      icon: 'fas fa-flag-checkered',
      color: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      textColor: 'text-white'
    },
    {
      key: 'delete',
      label: 'Xóa tất cả',
      icon: 'fas fa-trash',
      color: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 shadow-lg border border-blue-500/20 animate-[slideInDown_0.3s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-check-double text-white text-sm"></i>
          </div>
          <div>
            <div className="text-white font-semibold">
              {selectedCount} đơn được chọn
            </div>
            <div className="text-blue-100 text-sm">
              Chọn thao tác cho tất cả đơn đã chọn
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.key}
              onClick={() => onBulkAction(action.key)}
              className={`
                flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${action.color} 
                ${action.textColor} rounded-lg font-medium transition-all duration-200 
                transform hover:-translate-y-0.5 hover:shadow-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-white/20
              `}
            >
              <i className={`${action.icon} text-xs`}></i>
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">
                {action.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-3 w-full bg-white/20 rounded-full h-1">
        <div 
          className="bg-white h-1 rounded-full transition-all duration-300"
          style={{ width: `${Math.min((selectedCount / 20) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BulkActions;