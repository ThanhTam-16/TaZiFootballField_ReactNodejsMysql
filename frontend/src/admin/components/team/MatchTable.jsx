// ====== frontend/src/admin/components/team/MatchTable.jsx ======
const MatchTable = ({ matches, onRefresh, loading }) => {
  const formatDateTime = (date, time) => {
    const matchDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateStr;
    if (matchDate.toDateString() === today.toDateString()) {
      dateStr = 'Hôm nay';
    } else if (matchDate.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Ngày mai';
    } else {
      dateStr = matchDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      });
    }
    
    return `${dateStr} ${time?.slice(0, 5) || ''}`;
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      open: { 
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', 
        text: 'Đang mở',
        icon: 'fas fa-play-circle'
      },
      full: { 
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400', 
        text: 'Đầy',
        icon: 'fas fa-users'
      },
      completed: { 
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', 
        text: 'Hoàn thành',
        icon: 'fas fa-flag-checkered'
      },
      closed: { 
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', 
        text: 'Đóng',
        icon: 'fas fa-times-circle'
      }
    };
    return statusMap[status] || statusMap.open;
  };

  const getFieldTypeColor = (type) => {
    const colors = {
      '5vs5': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      '7vs7': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      '11vs11': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden">
        {matches.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-futbol text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có kèo nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có kèo nào được tạo
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {matches.map(match => {
              const statusConfig = getStatusConfig(match.status);
              
              return (
                <div 
                  key={match.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <i className="fas fa-futbol text-white text-sm"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          Kèo #{match.id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {match.creator_name || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                      <i className={`${statusConfig.icon} mr-1`}></i>
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Loại sân</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFieldTypeColor(match.field_type)}`}>
                        {match.field_type}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Thời gian</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDateTime(match.match_date, match.start_time)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số người</div>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {match.current_players}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Giá/người</div>
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {match.price_per_person?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <i className="fas fa-phone mr-1"></i>
                      {match.contact_phone}
                    </div>
                    
                    <div className="flex space-x-1">
                      <button className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200">
                        <i className="fas fa-eye text-xs"></i>
                      </button>
                      <button className="p-1.5 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors duration-200">
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID & Người tạo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sân & Thời gian
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Số người
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Giá/người
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {matches.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-futbol text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Không có kèo nào
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Chưa có kèo nào được tạo
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              matches.map(match => {
                const statusConfig = getStatusConfig(match.status);
                
                return (
                  <tr key={match.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">#{match.id}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {match.creator_name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {match.creator_phone || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFieldTypeColor(match.field_type)}`}>
                          {match.field_type}
                        </span>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDateTime(match.match_date, match.start_time)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {match.current_players}
                        </div>
                        
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {match.price_per_person?.toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {match.contact_name}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {match.contact_phone}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                        <i className={`${statusConfig.icon} mr-1`}></i>
                        {statusConfig.text}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <button
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye text-xs"></i>
                        </button>
                        <button
                          className="p-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200"
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
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
    </>
  );
};

export default MatchTable;