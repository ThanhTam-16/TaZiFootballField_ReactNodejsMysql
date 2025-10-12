import { useState, useEffect } from 'react';

function MatchCard({ match, onContact, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  const levelMap = {
    beginner: 'Mới chơi',
    intermediate: 'Trung bình',
    advanced: 'Khá',
    pro: 'Giỏi'
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatTime = () => {
    if (!match.start_time || !match.end_time) return '';
    const start = match.start_time.slice(0, 5);
    const end = match.end_time.slice(0, 5);
    return `${start}-${end}`;
  };

  // UPDATED: Unified blue theme for all field types
  const getFieldTypeColor = (type) => {
    const colorMap = {
      '5vs5': 'bg-blue-500 dark:bg-blue-600',
      '7vs7': 'bg-blue-500 dark:bg-blue-600',
      '11vs11': 'bg-blue-600 dark:bg-blue-700'
    };
    return colorMap[type] || 'bg-blue-500 dark:bg-blue-600';
  };

  // FIXED: Get the correct field type number
  const getFieldTypeNumber = (type) => {
    if (!type) return '5';
    
    // Extract number from field type (5vs5 -> 5, 7vs7 -> 7, 11vs11 -> 11)
    const match = type.match(/^(\d+)vs\d+$/);
    return match ? match[1] : '5';
  };

  // FIXED: Get the proper field display name
  const getFieldDisplayName = (type) => {
    if (!type) return 'Sân 5v5';
    
    const typeMap = {
      '5vs5': 'Sân 5v5',
      '7vs7': 'Sân 7v7', 
      '11vs11': 'Sân 11v11'
    };
    
    return typeMap[type] || 'Sân 5v5';
  };

  const ageText = match.age_min && match.age_max ? `${match.age_min}-${match.age_max}` : 'Tất cả';

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const fieldColor = getFieldTypeColor(match.field_type);

  return (
    <div className={`transition-all duration-500 hover-lift ${
      isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
    }`}>
      <div className="group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg dark:hover:shadow-blue-900/20 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 h-full">
        
        {/* Header - Clean blue solid color */}
        <div className={`${fieldColor} p-3 relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">{getFieldTypeNumber(match.field_type)}</span>
              </div>
              <div>
                <span className="text-white font-medium text-sm">
                  {getFieldDisplayName(match.field_type)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          
          {/* Date & Time - Blue theme */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fas fa-calendar text-blue-600 dark:text-blue-400 text-xs"></i>
                <span className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                  {formatDate(match.match_date)}
                </span>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-blue-700 dark:text-blue-300 text-sm">
                  {formatTime()}
                </div>
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <i className="fas fa-trophy text-gray-400 dark:text-gray-500"></i>
                <span>{levelMap[match.level] || 'Trung bình'}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">{ageText} tuổi</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <i className="fas fa-user text-gray-400 dark:text-gray-500"></i>
                <span className="truncate max-w-[100px]">{match.contact_name}</span>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatPrice(match.price_per_person)}
              </span>
            </div>
          </div>

          {/* Description */}
          {match.description && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {match.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer - Blue theme button */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onContact({ name: match.contact_name, phone: match.contact_phone })}
              className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-blue-900/30 flex items-center justify-center space-x-1 text-xs"
            >
              <i className="fas fa-phone text-xs"></i>
              <span>Liên hệ</span>
            </button>
          </div>
        </div>

        {/* Hover Effects - Blue theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 dark:from-blue-400/5 dark:to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
      </div>
    </div>
  );
}

export default MatchCard;