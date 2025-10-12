// ====== frontend/src/admin/components/team/TeamStats.jsx ======
const TeamStats = ({ stats, activeTab }) => {
  const statItems = [
    {
      key: 'total',
      icon: activeTab === 'matches' ? 'fas fa-futbol' : 'fas fa-users',
      value: stats.total || 0,
      label: `Tổng ${activeTab === 'matches' ? 'Kèo' : 'Ghép đội'}`,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      key: 'open',
      icon: 'fas fa-play-circle',
      value: stats.open || 0,
      label: 'Đang hoạt động',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      key: 'today',
      icon: 'fas fa-calendar-day',
      value: stats.today || 0,
      label: 'Hôm nay',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      key: 'thisWeek',
      icon: 'fas fa-chart-line',
      value: stats.thisWeek || 0,
      label: 'Tuần này',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statItems.map((item, index) => (
        <div 
          key={item.key}
          className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Gradient Background on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`}></div>
          
          <div className="relative">
            {/* Icon */}
            <div className={`w-8 h-8 md:w-10 md:h-10 ${item.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <i className={`${item.icon} ${item.iconColor} text-sm md:text-base`}></i>
            </div>

            {/* Value */}
            <div className="mb-1">
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {item.value}
              </div>
            </div>

            {/* Label */}
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">
              {item.label}
            </div>
          </div>

          {/* Activity Indicator */}
          <div className={`absolute top-2 right-2 w-2 h-2 ${
            item.key === 'open' && stats.open > 0 
              ? 'bg-emerald-500 animate-pulse' 
              : item.key === 'today' && stats.today > 0
                ? 'bg-amber-500 animate-pulse'
                : 'bg-gray-300 dark:bg-gray-600'
          } rounded-full`}></div>
        </div>
      ))}
    </div>
  );
};

export default TeamStats;