// ====== frontend/src/admin/components/team/TeamBulkActions.jsx ======
const TeamBulkActions = ({ selectedCount, onBulkAction, activeTab }) => {
  const actions = [
    {
      label: 'Mở',
      action: 'open',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      icon: 'fas fa-play-circle'
    },
    {
      label: 'Đóng',
      action: 'closed',
      color: 'bg-red-600 hover:bg-red-700',
      icon: 'fas fa-times-circle'
    },
    {
      label: 'Xóa',
      action: 'delete',
      color: 'bg-red-600 hover:bg-red-700',
      icon: 'fas fa-trash'
    }
  ];

  const handleAction = (action) => {
    onBulkAction(action);
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <i className="fas fa-layer-group text-white text-xs"></i>
          </div>
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Đã chọn {selectedCount} {activeTab === 'matches' ? 'kèo' : 'bài đăng'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action.action)}
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

export default TeamBulkActions;