// ====== frontend/src/admin/components/team/MatchTable.jsx (UPDATED - GIỐNG TEAMJOINTABLE) ======
const MatchTable = ({ matches, selectedMatches, onSelectMatch, onSelectAll, onViewDetail, onEditMatch, onDeleteMatch }) => {
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

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-futbol text-gray-400 text-lg"></i>
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Không có kèo nào
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Thử thay đổi bộ lọc hoặc tạo kèo mới
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-8 px-2 py-2 text-left">
                <input
                  type="checkbox"
                  checked={matches.length > 0 && selectedMatches.length === matches.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                />
              </th>
              
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                ID
              </th>
              
              {[ 
                { key: 'info', label: 'Thông tin kèo', width: 'w-48' },
                { key: 'details', label: 'Chi tiết', width: 'w-40' },
                { key: 'players', label: 'Số người', width: 'w-24' },
                { key: 'price', label: 'Giá', width: 'w-24' },
                { key: 'contact', label: 'Liên hệ', width: 'w-32' },
                { key: 'status', label: 'Trạng thái', width: 'w-20' },
                { key: 'actions', label: 'Thao tác', width: 'w-16' }
              ].map(column => (
                <th
                  key={column.key}
                  className={`px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.width}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {matches.map(match => {
              const statusConfig = getStatusConfig(match.status);
              const isSelected = selectedMatches.includes(match.id);
              
              return (
                <tr 
                  key={match.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onViewDetail(match.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetail(match.id); }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="px-2 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => { e.stopPropagation(); onSelectMatch(match.id, e.target.checked); }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </td>
                  
                  <td className="px-2 py-2">
                    <span 
                      className="text-xs font-medium text-gray-900 dark:text-white"
                     role="button"
                     tabIndex={0}
                     onClick={(e) => { e.stopPropagation(); onViewDetail(match.id); }}
                     onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onViewDetail(match.id); } }}
                    >
                      #{match.id}
                    </span>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {match.creator_name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {match.creator_phone || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getFieldTypeColor(match.field_type)}`}>
                          {match.field_type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-900 dark:text-white">
                        {formatDateTime(match.match_date, match.start_time)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {match.current_players || 0}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {match.price_per_person ? `${match.price_per_person.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {match.contact_name || 'N/A'}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {match.contact_phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.class}`}>
                      <i className={`${statusConfig.icon} mr-1 text-xs`}></i>
                      {statusConfig.text}
                    </span>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditMatch(match); }}
                        className="ml-2 p-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-all duration-200 text-xs"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteMatch(match.id); }}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200 text-xs"
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-2 p-3">
        {matches.map(match => {
          const statusConfig = getStatusConfig(match.status);
          const isSelected = selectedMatches.includes(match.id);
          
          return (
            <div 
              key={match.id} 
              role="button"
              tabIndex={0}
              onClick={() => onViewDetail(match.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetail(match.id); }}
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-sm transition-all duration-200 ${
                isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => { e.stopPropagation(); onSelectMatch(match.id, e.target.checked); }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1 mt-0.5"
                  />
                  
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onViewDetail(match.id); }}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:underline"
                    title={`Xem #${match.id}`}
                  >
                    #{match.id}
                  </button>
                  
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {match.creator_name || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {match.creator_phone || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.class}`}>
                  <i className={`${statusConfig.icon} mr-1 text-xs`}></i>
                  {statusConfig.text}
                </span>
              </div>

              {/* Content */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">Loại sân</div>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getFieldTypeColor(match.field_type)}`}>
                    {match.field_type}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">Thời gian</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatDateTime(match.match_date, match.start_time)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">Số người</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {match.current_players || 0}/{match.max_players || 10}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">Giá/người</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    {match.price_per_person ? `${match.price_per_person.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Liên hệ</div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {match.contact_name || 'N/A'}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {match.contact_phone || 'N/A'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                
                <button
                  onClick={(e) => { e.stopPropagation(); onEditMatch(match); }}
                  className="px-2 py-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors duration-200 text-xs flex items-center space-x-1"
                >
                  <i className="fas fa-edit text-xs"></i>
                  <span>Sửa</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteMatch(match.id); }}
                  className="px-2 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200 text-xs flex items-center space-x-1"
                >
                  <i className="fas fa-trash text-xs"></i>
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchTable;