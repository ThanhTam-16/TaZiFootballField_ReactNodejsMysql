// ====== frontend/src/admin/components/dashboard/QuickActions.jsx (TAILWIND) ======
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const QuickActions = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAdmin();

  const quickActions = [
    {
      title: 'Đặt sân mới',
      description: 'Tạo đơn đặt sân cho khách',
      icon: 'fas fa-plus-circle',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      permission: 'bookings',
      action: () => navigate('/admin/bookings?action=create')
    },
    {
      title: 'Thêm sân mới',
      description: 'Thêm sân bóng mới',
      icon: 'fas fa-futbol',
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
      permission: 'fields',
      action: () => navigate('/admin/fields?action=create')
    },
    {
      title: 'Thêm khách hàng',
      description: 'Đăng ký khách hàng mới',
      icon: 'fas fa-user-plus',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      permission: 'users',
      action: () => navigate('/admin/users?action=create')
    },
    {
      title: 'Lập lịch bảo trì',
      description: 'Tạo kế hoạch bảo trì sân',
      icon: 'fas fa-tools',
      color: 'from-amber-500 to-amber-600',
      hoverColor: 'hover:from-amber-600 hover:to-amber-700',
      permission: 'fields',
      action: () => navigate('/admin/maintenance?action=create')
    },
    {
      title: 'Xem báo cáo',
      description: 'Thống kê doanh thu',
      icon: 'fas fa-chart-line',
      color: 'from-rose-500 to-rose-600',
      hoverColor: 'hover:from-rose-600 hover:to-rose-700',
      permission: 'reports',
      action: () => navigate('/admin/reports')
    },
    {
      title: 'Quản lý kho',
      description: 'Kiểm tra tồn kho',
      icon: 'fas fa-boxes',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      permission: 'inventory',
      action: () => navigate('/admin/inventory')
    }
  ].filter(action => !action.permission || hasPermission(action.permission));

  const systemActions = [
    {
      title: 'Backup dữ liệu',
      icon: 'fas fa-download',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      action: () => alert('Tính năng sẽ được thêm')
    },
    {
      title: 'Cài đặt hệ thống',
      icon: 'fas fa-cog',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      action: () => navigate('/admin/settings')
    },
    {
      title: 'Hỗ trợ khách hàng',
      icon: 'fas fa-headset',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      action: () => navigate('/admin/support')
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-green-600 dark:text-green-400 text-sm"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thao tác nhanh
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Các tính năng thường dùng
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`group relative p-4 bg-gradient-to-r ${action.color} ${action.hoverColor} text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-8 h-8 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-6 h-6 bg-white/5 rounded-full"></div>
                
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <i className={`${action.icon} text-sm`}></i>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      <p className="text-xs text-white/80 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <i className="fas fa-cogs text-gray-600 dark:text-gray-400 text-sm"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Hệ thống
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Quản lý và cài đặt
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            {systemActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full flex items-center space-x-3 p-3 ${action.bgColor} hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 group`}
              >
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <i className={`${action.icon} ${action.color} text-sm`}></i>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {action.title}
                </span>
                <i className="fas fa-chevron-right text-gray-400 text-xs ml-auto"></i>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Thống kê nhanh
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sân đang hoạt động</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">8/10</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Đặt sân trong giờ</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">12 đơn</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Khách hàng mới</span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">+5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Doanh thu giờ</span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">2.5M VND</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;