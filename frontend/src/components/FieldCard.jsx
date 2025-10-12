import { useState, useEffect } from 'react';

function FieldCard({ field, searchInfo, onBook, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Fix: Handle both slots and available_slots
  const slots = field.available_slots || field.slots || [];
  const slot = slots[0];

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  // Debug log
  console.log('FieldCard rendering:', { 
    fieldName: field.name, 
    hasSlots: !!slot,
    slotsLength: slots.length,
    field 
  });

  // If no available slots, don't show card
  if (!slot) {
    console.log('No slot available for field:', field.name);
    return null;
  }

  // UPDATED: Simple solid colors - more professional look
  const getFieldTypeColor = (type) => {
    const colorMap = {
      '5vs5': 'bg-green-500 dark:bg-green-600',
      '7vs7': 'bg-emerald-500 dark:bg-emerald-600', 
      '11vs11': 'bg-green-600 dark:bg-green-700'
    };
    return colorMap[type] || 'bg-green-500 dark:bg-green-600';
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return '0';
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // FIXED: Get the correct field type number
  const getFieldTypeNumber = (type) => {
    if (!type) return '5';
    
    // Extract number from field type (5vs5 -> 5, 7vs7 -> 7, 11vs11 -> 11)
    const match = type.match(/^(\d+)vs\d+$/);
    return match ? match[1] : '5';
  };

  // FIXED: Calculate duration more accurately with minutes
  const getDurationInfo = () => {
    if (!searchInfo?.startTime || !searchInfo?.endTime) {
      return { duration: 1, durationText: '1h' };
    }
    
    const [startHour, startMinute] = searchInfo.startTime.split(':').map(Number);
    const [endHour, endMinute] = searchInfo.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    let durationText;
    if (minutes === 0) {
      durationText = `${hours}h`;
    } else {
      durationText = `${hours}h${minutes}p`;
    }
    
    // Return duration in hours (for calculation)
    const durationInHours = durationMinutes / 60;
    
    return { duration: durationInHours, durationText };
  };

  const { duration, durationText } = getDurationInfo();
  
  // FIXED: Calculate total price based on exact duration
  const totalPrice = slot.price * duration;

  const fieldColor = getFieldTypeColor(field.type);

  return (
    <div className={`transition-all duration-500 hover-lift ${
      isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
    }`}>
      <div className="group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg dark:hover:shadow-green-900/20 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 h-full">
        
        {/* Header - Clean solid color design */}
        <div className={`${fieldColor} p-3 relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {getFieldTypeNumber(field.type)}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {field.name || 'Sân bóng'}
                </h3>
              </div>
            </div>
            
            <span className="px-2 py-0.5 bg-white/20 text-white rounded-full text-xs font-medium">
              Trống
            </span>
          </div>
        </div>

        {/* Content - Enhanced Dark Mode */}
        <div className="p-3 space-y-3">
          
          {/* Time & Price Per Hour - Better Dark Mode */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 border border-green-200 dark:border-green-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock text-green-600 dark:text-green-400 text-xs"></i>
                <span className="font-medium text-green-800 dark:text-green-200 text-sm">
                  {searchInfo?.startTime || ''} - {searchInfo?.endTime || ''}
                </span>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-green-700 dark:text-green-300 text-sm">
                  {formatPrice(slot.price)}đ/giờ
                </div>
              </div>
            </div>
          </div>

          {/* Duration & Location Info - Enhanced Dark Mode */}
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <i className="fas fa-map-marker-alt text-gray-400 dark:text-gray-500"></i>
              <span>Khu vực trung tâm</span>
            </div>
            <div className="flex items-center space-x-1">
              <i className="fas fa-hourglass-half text-gray-400 dark:text-gray-500"></i>
              <span className="font-medium text-gray-700 dark:text-gray-300">{durationText}</span>
            </div>
          </div>
        </div>

        {/* Footer - Enhanced Dark Mode */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                {formatPrice(totalPrice)}đ
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Tổng tiền
              </div>
            </div>

            <button
              onClick={() => onBook(field, slot)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-green-900/30 flex items-center space-x-1.5 text-sm"
            >
              <i className="fas fa-calendar-plus"></i>
              <span>Đặt ngay</span>
            </button>
          </div>
        </div>

        {/* Hover Effects - Enhanced for Dark Mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 dark:from-green-400/5 dark:to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
      </div>
    </div>
  );
}

export default FieldCard;