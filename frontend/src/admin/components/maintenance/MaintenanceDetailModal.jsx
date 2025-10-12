// ====== frontend/src/admin/components/maintenance/MaintenanceDetailModal.jsx ======
const MaintenanceDetailModal = ({ 
  maintenance, 
  fields, 
  onClose, 
  onEdit, 
  onAction, 
  getFieldText, 
  getStatusText, 
  getTypeText 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      'scheduled': {
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        icon: 'fas fa-calendar-check',
        bgGradient: 'from-blue-500 to-blue-600'
      },
      'in_progress': {
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
        icon: 'fas fa-cog',
        bgGradient: 'from-amber-500 to-amber-600'
      },
      'completed': {
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
        icon: 'fas fa-check-circle',
        bgGradient: 'from-emerald-500 to-emerald-600'
      },
      'cancelled': {
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: 'fas fa-times-circle',
        bgGradient: 'from-red-500 to-red-600'
      }
    };
    return configs[status] || configs['scheduled'];
  };

  const getTypeConfig = (type) => {
    const configs = {
      'routine': {
        class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        icon: 'fas fa-calendar-alt'
      },
      'repair': {
        class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
        icon: 'fas fa-wrench'
      },
      'upgrade': {
        class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        icon: 'fas fa-arrow-up'
      },
      'holiday': {
        class: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
        icon: 'fas fa-calendar-times'
      },
      'emergency': {
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: 'fas fa-exclamation-triangle'
      }
    };
    return configs[type] || configs['routine'];
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'low': {
        class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        icon: 'fas fa-arrow-down'
      },
      'medium': {
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        icon: 'fas fa-minus'
      },
      'high': {
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
        icon: 'fas fa-arrow-up'
      },
      'urgent': {
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: 'fas fa-exclamation-triangle'
      }
    };
    return configs[priority] || configs['medium'];
  };

  const statusConfig = getStatusConfig(maintenance.status);
  const typeConfig = getTypeConfig(maintenance.type);
  const priorityConfig = getPriorityConfig(maintenance.priority);

  const isPastDue = maintenance.status === 'scheduled' && new Date(maintenance.scheduled_date) < new Date();
  const canStart = maintenance.status === 'scheduled';
  const canComplete = maintenance.status === 'in_progress';
  const canCancel = ['scheduled', 'in_progress'].includes(maintenance.status);

  const getPriorityText = (priority) => {
    const priorities = {
      'low': 'Thấp',
      'medium': 'Trung bình', 
      'high': 'Cao',
      'urgent': 'Khẩn cấp'
    };
    return priorities[priority] || 'Trung bình';
  };

  const getProgressPercentage = () => {
    switch (maintenance.status) {
      case 'completed': return 100;
      case 'in_progress': return 50;
      case 'scheduled': return 0;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-enter">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${statusConfig.bgGradient} rounded-xl flex items-center justify-center`}>
                <i className={`${statusConfig.icon} text-white text-lg ${maintenance.status === 'in_progress' ? 'animate-spin' : ''}`}></i>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {maintenance.title}
                  </h3>
                  {isPastDue && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      Quá hạn
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Chi tiết thông tin và tiến độ bảo trì
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiến độ thực hiện</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${statusConfig.bgGradient}`}
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Bắt đầu</span>
                <span>Đang thực hiện</span>
                <span>Hoàn thành</span>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                  Thông tin cơ bản
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sân:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getFieldText(maintenance.field_id)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Loại bảo trì:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.class}`}>
                      <i className={`${typeConfig.icon} mr-1`}></i>
                      {getTypeText(maintenance.type)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                      <i className={`${statusConfig.icon} mr-1 ${maintenance.status === 'in_progress' ? 'animate-spin' : ''}`}></i>
                      {getStatusText(maintenance.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Độ ưu tiên:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.class}`}>
                      <i className={`${priorityConfig.icon} mr-1`}></i>
                      {getPriorityText(maintenance.priority)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ngày tạo:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDateTime(maintenance.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fas fa-calendar-alt text-purple-500 mr-2"></i>
                  Lịch trình
                </h4>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Ngày thực hiện:</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatDate(maintenance.scheduled_date)}
                      </span>
                    </div>
                  </div>
                  
                  {maintenance.start_time && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Giờ bắt đầu:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {maintenance.start_time}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {maintenance.end_time && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Giờ kết thúc:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {maintenance.end_time}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {maintenance.estimated_duration && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Thời gian dự kiến:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {maintenance.estimated_duration} giờ
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-file-alt text-green-500 mr-2"></i>
                Mô tả công việc
              </h4>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {maintenance.description}
                </p>
              </div>
            </div>

            {/* Notes */}
            {maintenance.notes && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fas fa-sticky-note text-amber-500 mr-2"></i>
                  Ghi chú
                </h4>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {maintenance.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-history text-blue-500 mr-2"></i>
                Lịch sử thay đổi
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <i className="fas fa-plus text-blue-600 dark:text-blue-400 text-xs"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Lịch bảo trì được tạo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(maintenance.created_at)}
                    </p>
                  </div>
                </div>

                {maintenance.started_at && (
                  <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                      <i className="fas fa-play text-amber-600 dark:text-amber-400 text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Bắt đầu thực hiện
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(maintenance.started_at)}
                      </p>
                    </div>
                  </div>
                )}

                {maintenance.completed_at && (
                  <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-emerald-600 dark:text-emerald-400 text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Hoàn thành bảo trì
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(maintenance.completed_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {canStart && (
                <button
                  onClick={() => onAction('in_progress', maintenance.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all duration-200 flex items-center space-x-2"
                >
                  <i className="fas fa-play text-sm"></i>
                  <span>Bắt đầu</span>
                </button>
              )}
              
              {canComplete && (
                <button
                  onClick={() => onAction('completed', maintenance.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center space-x-2"
                >
                  <i className="fas fa-check text-sm"></i>
                  <span>Hoàn thành</span>
                </button>
              )}
              
              {canCancel && (
                <button
                  onClick={() => onAction('cancelled', maintenance.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center space-x-2"
                >
                  <i className="fas fa-times text-sm"></i>
                  <span>Hủy</span>
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Đóng
              </button>
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all duration-200 flex items-center space-x-2"
              >
                <i className="fas fa-edit text-sm"></i>
                <span>Chỉnh sửa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetailModal;