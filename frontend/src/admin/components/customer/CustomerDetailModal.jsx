// ====== frontend/src/admin/components/customer/CustomerDetailModal.jsx (TAILWIND VERSION) ======
import { customerService } from '../../services';

const CustomerDetailModal = ({ customer, onClose, onEdit }) => {
  const formatDate = (dateString) => {
    return customerService.formatDate(dateString);
  };

  const formatCurrency = (amount) => {
    return customerService.formatCurrency(amount);
  };

  const calculateSuccessRate = (customer) => {
    return customerService.calculateSuccessRate(customer);
  };

  const successRate = calculateSuccessRate(customer);
  const isVIP = customer.total_bookings >= 10;

  const statsCards = [
    {
      icon: 'fas fa-calendar-check',
      value: customer.total_bookings,
      label: 'Tổng đặt sân',
      color: 'blue'
    },
    {
      icon: 'fas fa-check-circle',
      value: customer.completed_bookings,
      label: 'Hoàn thành',
      color: 'emerald'
    },
    {
      icon: 'fas fa-times-circle',
      value: customer.cancelled_bookings,
      label: 'Đã hủy',
      color: 'red'
    },
    {
      icon: 'fas fa-percentage',
      value: `${successRate.toFixed(1)}%`,
      label: 'Tỷ lệ thành công',
      color: successRate >= 80 ? 'emerald' : successRate >= 50 ? 'amber' : 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
      red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-enter">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {customer.name}
                  </h3>
                  {isVIP && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300">
                      <i className="fas fa-star mr-1 text-xs"></i>
                      VIP Customer
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    customer.is_active 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      customer.is_active ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></div>
                    {customer.is_active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Chi tiết thông tin và hoạt động của khách hàng
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
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className={`w-10 h-10 ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <i className={`${stat.icon} text-lg`}></i>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fas fa-user text-blue-500 mr-2"></i>
                  Thông tin cơ bản
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tên khách hàng:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Số điện thoại:</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{customer.phone_number}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.email || 'Chưa có'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ngày tạo:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(customer.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lần đặt cuối:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(customer.last_booking_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fas fa-money-bill-wave text-emerald-500 mr-2"></i>
                  Thông tin tài chính
                </h4>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tổng chi tiêu:</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(customer.total_spent)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Trung bình mỗi lần:</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(customer.total_bookings > 0 ? 
                          customer.total_spent / customer.total_bookings : 0)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Loại khách hàng:</span>
                      <div>
                        {isVIP ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300">
                            <i className="fas fa-star mr-1 text-xs"></i>
                            VIP
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Thường
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Statistics */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-chart-bar text-purple-500 mr-2"></i>
                Thống kê đặt sân chi tiết
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Success Rate Visualization */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${successRate}, 100`}
                          className={`${successRate >= 80 ? 'text-emerald-500' : successRate >= 50 ? 'text-amber-500' : 'text-red-500'}`}
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-200 dark:text-gray-600"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {successRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ thành công</p>
                  </div>
                </div>

                {/* Booking Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">Phân tích đặt sân</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành:</span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {customer.completed_bookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Đã hủy:</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        {customer.cancelled_bookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Đang chờ:</span>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {customer.total_bookings - customer.completed_bookings - customer.cancelled_bookings}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">Hoạt động gần đây</h5>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Đặt sân thành công</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Cập nhật thông tin</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Đăng ký thành viên</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Đóng
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center space-x-2"
            >
              <i className="fas fa-edit text-sm"></i>
              <span>Chỉnh sửa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;