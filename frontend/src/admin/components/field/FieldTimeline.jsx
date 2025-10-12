// ====== frontend/src/admin/components/field/FieldTimeline.jsx (TAILWIND) ======
const FieldTimeline = ({ fieldsData, onTimeSlotClick, filters }) => {
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour <= 23; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const getBookingForTimeSlot = (fieldId, hour) => {
    const field = fieldsData.find(f => f.id === fieldId);
    if (!field) return null;

    const booking = field.bookings?.find(b => {
      const startHour = parseInt(b.start_time.split(':')[0]);
      const endHour = parseInt(b.end_time.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });

    if (booking) return { ...booking, type: 'booking' };

    const maintenance = field.maintenance?.find(m => {
      const startHour = parseInt(m.start_time.split(':')[0]);
      const endHour = parseInt(m.end_time.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });

    if (maintenance) return { ...maintenance, type: 'maintenance' };

    return null;
  };

  const filteredFields = fieldsData.filter(field => {
    if (filters.fieldType !== 'all' && field.type !== filters.fieldType) {
      return false;
    }
    return true;
  });

  const timeSlots = getTimeSlots();

  return (
    <div className="overflow-hidden">
      {/* Timeline Header */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 sticky top-0 z-20">
        <div className="flex">
          {/* Field Column Header */}
          <div className="w-24 md:w-32 lg:w-40 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Sân</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {filteredFields.length} sân
              </div>
            </div>
          </div>
          
          {/* Time Headers */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex" style={{ minWidth: `${timeSlots.length * 60}px` }}>
              {timeSlots.map(hour => (
                <div 
                  key={hour} 
                  className="w-15 flex-shrink-0 p-2 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0"
                  style={{ width: '60px' }}
                >
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {hour}:00
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {hour < 12 ? 'AM' : 'PM'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Body */}
      <div className="max-h-[60vh] overflow-y-auto">
        {filteredFields.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              Không có sân nào phù hợp với bộ lọc
            </div>
          </div>
        ) : (
          filteredFields.map((field, fieldIndex) => (
            <div 
              key={field.id} 
              className="flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              style={{
                animationDelay: `${fieldIndex * 100}ms`
              }}
            >
              {/* Field Info Column */}
              <div className="w-24 md:w-32 lg:w-40 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="text-center">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white truncate" title={field.name}>
                    {field.name}
                  </div>
                  <div className={`inline-block px-2 py-0.5 mt-1 text-xs font-medium rounded-full ${
                    field.type === '5vs5' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : field.type === '7vs7'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                  }`}>
                    {field.type}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {field.price_per_hour ? `${(field.price_per_hour / 1000).toFixed(0)}K/h` : ''}
                  </div>
                </div>
              </div>
              
              {/* Timeline Slots */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex relative" style={{ minWidth: `${timeSlots.length * 60}px` }}>
                  {timeSlots.map(hour => {
                    const booking = getBookingForTimeSlot(field.id, hour);
                    const isFirstHour = booking && parseInt(booking.start_time?.split(':')[0]) === hour;
                    const isEmpty = !booking;
                    
                    return (
                      <div 
                        key={hour}
                        className={`w-15 h-16 border-r border-gray-200 dark:border-gray-600 last:border-r-0 relative cursor-pointer transition-all duration-200 ${
                          isEmpty 
                            ? 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 bg-gradient-to-b from-emerald-50/50 to-emerald-100/50 dark:from-emerald-900/10 dark:to-emerald-900/20' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        style={{ width: '60px' }}
                        onClick={() => onTimeSlotClick(field.id, hour, booking)}
                        title={
                          booking 
                            ? booking.type === 'maintenance' 
                              ? 'Bảo trì sân' 
                              : `${booking.customer_name} - ${booking.phone_number}`
                            : 'Nhấn để đặt sân'
                        }
                      >
                        {/* Available slot indicator */}
                        {isEmpty && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <i className="fas fa-plus text-emerald-500 text-lg"></i>
                          </div>
                        )}
                        
                        {/* Booking Block */}
                        {booking && isFirstHour && (
                          <BookingBlock booking={booking} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Separate component for booking blocks
const BookingBlock = ({ booking }) => {
  const startHour = parseInt(booking.start_time?.split(':')[0] || 0);
  const endHour = parseInt(booking.end_time?.split(':')[0] || startHour + 1);
  const duration = endHour - startHour;
  
  const getBlockStyles = () => {
    const baseStyles = "absolute inset-y-1 left-1 rounded-lg flex flex-col justify-center items-center text-center p-1 transition-all duration-300 hover:scale-105 hover:z-10 shadow-sm hover:shadow-md";
    
    // Calculate width based on duration
    const width = `${duration * 60 - 4}px`; // 60px per hour minus padding
    
    if (booking.type === 'maintenance') {
      return {
        className: `${baseStyles} bg-gradient-to-r from-purple-500 to-purple-600 text-white`,
        style: { width, background: 'repeating-linear-gradient(45deg, rgb(147 51 234), rgb(147 51 234) 6px, rgb(126 34 206) 6px, rgb(126 34 206) 12px)' }
      };
    }
    
    switch (booking.status) {
      case 'pending':
        return {
          className: `${baseStyles} bg-gradient-to-r from-amber-500 to-amber-600 text-white`,
          style: { width }
        };
      case 'approved':
      case 'booked':
        return {
          className: `${baseStyles} bg-gradient-to-r from-blue-500 to-blue-600 text-white`,
          style: { width }
        };
      case 'completed':
        return {
          className: `${baseStyles} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white`,
          style: { width }
        };
      default:
        return {
          className: `${baseStyles} bg-gradient-to-r from-gray-500 to-gray-600 text-white`,
          style: { width }
        };
    }
  };

  const { className, style } = getBlockStyles();

  return (
    <div className={className} style={style}>
      {booking.type === 'maintenance' ? (
        <div className="w-full">
          <div className="text-xs font-bold truncate">Bảo trì</div>
          <div className="text-xs opacity-90 truncate">
            {booking.start_time} - {booking.end_time}
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="text-xs font-bold truncate" title={booking.customer_name}>
            {booking.customer_name}
          </div>
          <div className="text-xs opacity-90 truncate" title={booking.phone_number}>
            {booking.phone_number}
          </div>
          {duration > 1 && (
            <div className="text-xs opacity-75 mt-0.5">
              {duration}h
            </div>
          )}
        </div>
      )}
      
      {/* Status indicator */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
        booking.status === 'pending' ? 'bg-amber-400' :
        booking.status === 'approved' ? 'bg-blue-400' :
        booking.status === 'completed' ? 'bg-emerald-400' :
        booking.type === 'maintenance' ? 'bg-purple-400' : 'bg-gray-400'
      }`}></div>
    </div>
  );
};

export default FieldTimeline;