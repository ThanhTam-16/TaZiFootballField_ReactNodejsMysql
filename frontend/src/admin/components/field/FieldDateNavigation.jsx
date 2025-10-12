// ====== frontend/src/admin/components/field/FieldDateNavigation.jsx (TAILWIND) ======
const FieldDateNavigation = ({ currentDate, onChangeDate, onGoToToday, formatDate }) => {
  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  const getDateDifference = () => {
    const today = new Date();
    const diffTime = currentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    if (diffDays === -1) return 'Hôm qua';
    if (diffDays > 1) return `+${diffDays} ngày`;
    return `${Math.abs(diffDays)} ngày trước`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        {/* Previous Day Button */}
        <button
          onClick={() => onChangeDate(-1)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {/* Current Date Display */}
        <div className="flex-1 text-center px-4">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {formatDate(currentDate)}
            </h2>
            
            {/* Date difference indicator */}
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                isToday() 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
              }`}>
                {getDateDifference()}
              </span>
            </div>
          </div>

          {/* Today Button */}
          {!isToday() && (
            <button
              onClick={onGoToToday}
              className="mt-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <i className="fas fa-calendar-day mr-1"></i>
              Hôm nay
            </button>
          )}
        </div>

        {/* Next Day Button */}
        <button
          onClick={() => onChangeDate(1)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Quick Navigation */}
      <div className="flex items-center justify-center space-x-2 mt-4 overflow-x-auto pb-2">
        {[-2, -1, 0, 1, 2].map((dayOffset) => {
          const date = new Date();
          date.setDate(date.getDate() + dayOffset);
          const isSelected = date.toDateString() === currentDate.toDateString();
          const isCurrentDay = dayOffset === 0;
          
          return (
            <button
              key={dayOffset}
              onClick={() => {
                const newDate = new Date();
                newDate.setDate(newDate.getDate() + dayOffset);
                onChangeDate(dayOffset - Math.ceil((currentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
              }}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg'
                  : isCurrentDay
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">
                  {date.getDate()}
                </div>
                <div className="text-xs opacity-75">
                  {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FieldDateNavigation;