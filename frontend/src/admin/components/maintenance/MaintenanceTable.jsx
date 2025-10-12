// ====== frontend/src/admin/components/maintenance/MaintenanceTable.jsx ======
import { SkeletonTableRow } from '../common/LoadingSpinner';

const MaintenanceTable = ({
  maintenances,
  selectedMaintenances,
  filters,
  fields,
  onSelectMaintenance,
  onSelectAll,
  onSort,
  onViewDetail,
  onEditMaintenance,
  onDeleteMaintenance,
  onMaintenanceAction,
  getFieldText,
  getStatusText,
  getTypeText,
  loading
}) => {
  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return 'fas fa-sort text-gray-300';
    return filters.sortOrder === 'ASC' 
      ? 'fas fa-sort-up text-blue-500' 
      : 'fas fa-sort-down text-blue-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
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
        icon: 'fas fa-calendar-check'
      },
      'in_progress': {
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
        icon: 'fas fa-cog animate-spin'
      },
      'completed': {
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
        icon: 'fas fa-check-circle'
      },
      'cancelled': {
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: 'fas fa-times-circle'
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

  const isPastDue = (scheduledDate, status) => {
    return status === 'scheduled' && new Date(scheduledDate) < new Date();
  };

  if (loading && maintenances.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bảo trì</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sân</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Loại</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <SkeletonTableRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {maintenances.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-tools text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có lịch bảo trì
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có lịch bảo trì nào phù hợp với bộ lọc
            </p>
          </div>
        ) : (
          maintenances.map((maintenance) => {
            const statusConfig = getStatusConfig(maintenance.status);
            const typeConfig = getTypeConfig(maintenance.type);
            const isSelected = selectedMaintenances.includes(maintenance.id);
            const isOverdue = isPastDue(maintenance.scheduled_date, maintenance.status);
            
            return (
              <div 
                key={maintenance.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${
                  isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                } ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectMaintenance(maintenance.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className={`w-10 h-10 ${typeConfig.class} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`${typeConfig.icon} text-sm`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {maintenance.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getFieldText(maintenance.field_id)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                      <i className={`${statusConfig.icon} mr-1`}></i>
                      {getStatusText(maintenance.status)}
                    </span>
                    {isOverdue && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        Quá hạn
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {maintenance.description}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Ngày:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatDate(maintenance.scheduled_date)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Loại:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {getTypeText(maintenance.type)}
                      </div>
                    </div>
                    
                    {maintenance.start_time && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Bắt đầu:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {maintenance.start_time}
                        </div>
                      </div>
                    )}
                    
                    {maintenance.end_time && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Kết thúc:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {maintenance.end_time}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetail(maintenance.id)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-eye mr-1"></i>
                      Xem
                    </button>
                    <button
                      onClick={() => onEditMaintenance(maintenance)}
                      className="px-3 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Sửa
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  {maintenance.status === 'scheduled' && (
                    <button
                      onClick={() => onMaintenanceAction('in_progress', maintenance.id)}
                      className="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-play mr-1"></i>
                      Bắt đầu
                    </button>
                  )}
                  
                  {maintenance.status === 'in_progress' && (
                    <button
                      onClick={() => onMaintenanceAction('completed', maintenance.id)}
                      className="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-check mr-1"></i>
                      Hoàn thành
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedMaintenances.length === maintenances.length && maintenances.length > 0}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <th 
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => onSort('title')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Bảo trì</span>
                    <i className={`${getSortIcon('title')} text-xs`}></i>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sân
                </th>
                <th 
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => onSort('scheduled_date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Ngày thực hiện</span>
                    <i className={`${getSortIcon('scheduled_date')} text-xs`}></i>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Loại
                </th>
                <th 
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => onSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Trạng thái</span>
                    <i className={`${getSortIcon('status')} text-xs`}></i>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {maintenances.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-tools text-gray-400 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Không có lịch bảo trì
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Chưa có lịch bảo trì nào phù hợp với bộ lọc
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                maintenances.map((maintenance) => {
                  const statusConfig = getStatusConfig(maintenance.status);
                  const typeConfig = getTypeConfig(maintenance.type);
                  const isSelected = selectedMaintenances.includes(maintenance.id);
                  const isOverdue = isPastDue(maintenance.scheduled_date, maintenance.status);
                  
                  return (
                    <tr 
                      key={maintenance.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      } ${isOverdue ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectMaintenance(maintenance.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                      
                      <td className="px-3 py-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${typeConfig.class} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <i className={`${typeConfig.icon} text-xs`}></i>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {maintenance.title}
                              </p>
                              {isOverdue && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                  <i className="fas fa-exclamation-triangle mr-1"></i>
                                  Quá hạn
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {maintenance.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-3 py-3">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getFieldText(maintenance.field_id)}
                        </div>
                      </td>
                      
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(maintenance.scheduled_date)}
                          </div>
                          {(maintenance.start_time || maintenance.end_time) && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {maintenance.start_time && maintenance.end_time 
                                ? `${maintenance.start_time} - ${maintenance.end_time}`
                                : maintenance.start_time || maintenance.end_time
                              }
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.class}`}>
                          <i className={`${typeConfig.icon} mr-1`}></i>
                          {getTypeText(maintenance.type)}
                        </span>
                      </td>
                      
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                          <i className={`${statusConfig.icon} mr-1`}></i>
                          {getStatusText(maintenance.status)}
                        </span>
                      </td>
                      
                      <td className="px-3 py-3">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => onViewDetail(maintenance.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye text-xs"></i>
                          </button>
                          
                          {maintenance.status === 'scheduled' && (
                            <button
                              onClick={() => onMaintenanceAction('in_progress', maintenance.id)}
                              className="p-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200"
                              title="Bắt đầu bảo trì"
                            >
                              <i className="fas fa-play text-xs"></i>
                            </button>
                          )}
                          
                          {maintenance.status === 'in_progress' && (
                            <button
                              onClick={() => onMaintenanceAction('completed', maintenance.id)}
                              className="p-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200"
                              title="Hoàn thành bảo trì"
                            >
                              <i className="fas fa-check text-xs"></i>
                            </button>
                          )}
                          
                          <button
                            onClick={() => onEditMaintenance(maintenance)}
                            className="p-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200"
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          
                          <button
                            onClick={() => onDeleteMaintenance(maintenance.id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            title="Xóa"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MaintenanceTable;