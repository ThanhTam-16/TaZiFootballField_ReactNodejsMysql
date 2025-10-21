// ====== frontend/src/admin/components/team/TeamJoinTable.jsx (FIXED) ======
const TeamJoinTable = ({ teamJoins, selectedPosts, onSelectPost, onSelectAll, onViewDetail, onEditPost, onDeletePost }) => {
  const formatDate = (date) => {
    const postDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (postDate.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (postDate.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return postDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      open: { 
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', 
        text: 'Đang mở',
        icon: 'fas fa-play-circle'
      },
      closed: { 
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', 
        text: 'Đóng',
        icon: 'fas fa-times-circle'
      }
    };
    return statusMap[status] || statusMap.open;
  };

  const getPositionColor = (position) => {
    const colors = {
      'goalkeeper': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'defender': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'midfielder': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'forward': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'any': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[position] || colors.any;
  };

  const getPositionText = (position) => {
    const positionMap = {
      'goalkeeper': 'Thủ môn',
      'defender': 'Hậu vệ',
      'midfielder': 'Tiền vệ',
      'forward': 'Tiền đạo',
      'any': 'Bất kỳ'
    };
    return positionMap[position] || position;
  };

  if (teamJoins.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-users text-gray-400 text-lg"></i>
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Không có bài ghép đội nào
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Thử thay đổi bộ lọc hoặc tạo bài mới
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
                  checked={teamJoins.length > 0 && selectedPosts.length === teamJoins.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                />
              </th>

              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                ID
              </th>
              
              {[ 
                { key: 'info', label: 'Thông tin', width: 'w-48' },
                { key: 'details', label: 'Chi tiết', width: 'w-40' },
                { key: 'contact', label: 'Liên hệ', width: 'w-32' },
                { key: 'date', label: 'Ngày đăng', width: 'w-20' },
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
            {teamJoins.map(post => {
              const statusConfig = getStatusConfig(post.status);
              const isSelected = selectedPosts.includes(post.id);
              
              return (
                <tr 
                  key={post.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onViewDetail(post.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetail(post.id); }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="px-2 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => { e.stopPropagation(); onSelectPost(post.id, e.target.checked); }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </td>
                  
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onViewDetail(post.id); }}
                      className="text-xs font-medium text-gray-900 dark:text-white hover:underline"
                      title={`Xem #${post.id}`}
                    >
                      #{post.id}
                    </button>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {post.contact_name || post.title || `Ghép đội #${post.id}`}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {post.contact_phone || post.description || 'Không có mô tả'}
                        </div>
                        {/* Title/description below */}
                        { (post.title || post.description) && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                            {post.title ? post.title : ''}{post.title && post.description ? ' — ' : ''}{post.description ? post.description : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Vị trí:</span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(post.position_needed)}`}>
                          {getPositionText(post.position_needed)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Cần:</span>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          {post.players_needed} người
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Trình độ:</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {post.level || 'Tất cả'}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {post.contact_name || 'N/A'}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {post.contact_phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(post.created_at)}
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.class}`}>
                      <i className={`${statusConfig.icon} mr-1 text-xs`}></i>
                      {statusConfig.text}
                    </span>
                  </td>
                  
                  <td className="px-2 py-2 ">
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditPost(post); }}
                        className="p-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-all duration-200 text-xs"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeletePost(post.id); }}
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
        {teamJoins.map(post => {
          const statusConfig = getStatusConfig(post.status);
          const isSelected = selectedPosts.includes(post.id);
          
          return (
            <div 
              key={post.id} 
              role="button"
              tabIndex={0}
              onClick={() => onViewDetail(post.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetail(post.id); }}
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-sm transition-all duration-200 ${
                isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => { e.stopPropagation(); onSelectPost(post.id, e.target.checked); }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1 mt-0.5"
                  />
                  
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onViewDetail(post.id); }}
                      className="text-xs font-bold text-gray-900 dark:text-white hover:underline"
                      title={`Xem #${post.id}`}
                    >
                      #{post.id}
                    </button>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {post.contact_name || post.title || `Ghép đội #${post.id}`}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {post.contact_phone || post.description || 'Không có mô tả'}
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
                  <div className="text-gray-500 dark:text-gray-400">Vị trí</div>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(post.position_needed)}`}>
                    {getPositionText(post.position_needed)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">Số người cần</div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    {post.players_needed} người
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">Trình độ</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {post.level || 'Tất cả'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">Ngày đăng</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatDate(post.created_at)}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Liên hệ</div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {post.contact_name || 'N/A'}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {post.contact_phone || 'N/A'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                
                <button
                  onClick={(e) => { e.stopPropagation(); onEditPost(post); }}
                  className="px-2 py-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors duration-200 text-xs flex items-center space-x-1"
                >
                  <i className="fas fa-edit text-xs"></i>
                  <span>Sửa</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeletePost(post.id); }}
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

export default TeamJoinTable;