// ====== frontend/src/admin/components/field/FieldDateNavigation.jsx (WITH CALENDAR) ======
import { useState, useRef, useEffect } from 'react';

const FieldDateNavigation = ({ currentDate, onChangeDate, onGoToToday, onDateSelect, formatDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

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

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Starting day (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay();
    
    const days = [];
    const today = new Date();
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === currentDate.toDateString()
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === currentDate.toDateString()
      });
    }
    
    // Next month days (to fill the grid)
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === currentDate.toDateString()
      });
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    onDateSelect(date);
    setShowCalendar(false);
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-center justify-between">
        {/* Previous Day Button */}
        <button
          onClick={() => onChangeDate(-1)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {/* Current Date Display with Calendar Picker */}
        <div className="flex-1 text-center px-4 relative" ref={calendarRef}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {formatDate(currentDate)}
              </h2>
              
              {/* Date difference indicator */}
              <div className="flex items-center justify-center space-x-2">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  isToday() 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                }`}>
                  {getDateDifference()}
                </span>
                <i className="fas fa-calendar-alt text-gray-400 group-hover:text-blue-500 transition-colors duration-200"></i>
              </div>
            </div>
          </button>

          {/* Calendar Dropdown */}
          {showCalendar && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-2">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => onChangeDate(-30)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-chevron-left text-gray-600 dark:text-gray-400"></i>
                </button>
                
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                
                <button
                  onClick={() => onChangeDate(30)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-chevron-right text-gray-600 dark:text-gray-400"></i>
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                      day.isSelected
                        ? 'bg-blue-600 text-white shadow-lg'
                        : day.isToday
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : day.isCurrentMonth
                            ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex justify-between mt-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    onGoToToday();
                    setShowCalendar(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-calendar-day"></i>
                  <span>Hôm nay</span>
                </button>
                
                <button
                  onClick={() => setShowCalendar(false)}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Đóng
                </button>
              </div>
            </div>
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
      <div className="flex items-center justify-center space-x-2 mt-2 overflow-x-auto pb-1">
        {[-3, -2, -1, 0, 1, 2, 3].map((dayOffset) => {
          const date = new Date();
          date.setDate(date.getDate() + dayOffset);
          const isSelected = date.toDateString() === currentDate.toDateString();
          const isCurrentDay = dayOffset === 0;
          
          return (
            <button
              key={dayOffset}
              onClick={() => onDateSelect(date)}
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