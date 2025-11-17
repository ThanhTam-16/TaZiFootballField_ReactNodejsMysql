import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingSearchForm from '../components/BookingSearchForm';
import FieldCard from '../components/FieldCard';
import BookingModal from '../components/BookingModal';
import { createBooking } from '../services/bookingService';
import LoginModal from '../components/LoginModal';
import { Helmet } from 'react-helmet';
import { useToast } from '../hooks/useToast';

function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [searchInfo, setSearchInfo] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const resultRef = useRef(null);
  const { showSuccess, showError, showInfo } = useToast();

  // Auto scroll to results when search is performed
  useEffect(() => {
    if (searchInfo && resultRef.current) {
      const timer = setTimeout(() => {
        resultRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchInfo]);

  // Update search state when fields change
  useEffect(() => {
    if (searchInfo) {
      setSearchPerformed(true);
    }
  }, [fields, searchInfo]);

  const handleConfirmBooking = async (formData) => {
    if (!user) {
      showInfo('Vui lòng đăng nhập để đặt sân');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        user_id: user.id,
        field_id: selected.field.id,
        booking_date: searchInfo.date,
        start_time: selected.slot.start_time,
        end_time: selected.slot.end_time,
        total_amount: selected.slot.price,
        payment_method: formData.payment,
        notes: formData.note,
        phone_number: formData.phone,
        customer_name: formData.name,
      };

      await createBooking(payload);
      showSuccess('Đặt sân thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
      setSelected(null);
      
      // Refresh search results
      if (searchInfo) {
        const updatedFields = fields.filter(f => f.id !== selected.field.id);
        setFields(updatedFields);
      }
    } catch (err) {
      console.error('Booking error:', err);
      showError('Đặt sân thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = (field, slot) => {
    if (!user) {
      // Show login modal
      const modal = document.getElementById('login-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    } else {
      setSelected({ field, slot });
    }
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    if (!searchInfo?.startTime || !searchInfo?.endTime) return 0;
    
    const [startHour, startMinute] = searchInfo.startTime.split(':').map(Number);
    const [endHour, endMinute] = searchInfo.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${minutes}p`;
    }
  };

  const getFieldTypeLabels = (types) => {
    const labels = {
      '5': '5v5',
      '7': '7v7',
      '11': '11v11'
    };
    return types.map(type => labels[type] || type).join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      
      <Helmet>
        <title>Đặt sân bóng - TaZiFootball</title>
        <meta name="description" content="Đặt sân bóng trực tuyến nhanh chóng và tiện lợi với hệ thống tìm kiếm thông minh." />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-300 via-green-100 to-emerald-200 dark:from-gray-800 dark:via-green-800 dark:to-emerald-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-2xl animate-float"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-emerald-300 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-400 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-green-300 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-teal-300 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 md:py-12">
            <div className="text-center text-green-800 dark:text-white animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-green-200 rounded-full px-3 py-1.5 mb-4">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-800">Đặt sân nhanh chóng & tiện lợi</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-green-800 dark:text-white">
                Đặt sân bóng{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  yêu thích
                </span>
              </h1>
              
              <p className="text-sm md:text-base lg:text-lg text-green-700 dark:text-green-100 max-w-2xl mx-auto leading-relaxed">
                Tìm và đặt sân bóng trống nhanh chóng với hệ thống tìm kiếm thông minh
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 md:mt-8 mb-4 max-w-md mx-auto">
                <div className="text-center bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-3">
                  <div className="text-lg md:text-xl font-bold text-green-800">500+</div>
                  <div className="text-xs text-green-700">Sân bóng</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-3">
                  <div className="text-lg md:text-xl font-bold text-green-800">24/7</div>
                  <div className="text-xs text-green-700">Hỗ trợ</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-3">
                  <div className="text-lg md:text-xl font-bold text-green-800">99%</div>
                  <div className="text-xs text-green-700">Hài lòng</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="relative -mt-8 md:-mt-12 pb-8">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
            <BookingSearchForm 
              setFields={setFields} 
              setSearchInfo={setSearchInfo}
            />
          </div>
        </section>

        {/* Results Section */}
        <section ref={resultRef} className="py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            
            {/* Results Header */}
            <div className="mb-6 md:mb-8">
              {!searchPerformed ? (
                <div className="text-center animate-fade-in">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-search text-white text-2xl"></i>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Sẵn sàng tìm sân?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm md:text-base">
                    Sử dụng form tìm kiếm ở trên để xem các sân bóng có sẵn theo thời gian bạn muốn
                  </p>
                </div>
              ) : (
                <div className="animate-slide-up">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Kết quả tìm kiếm
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        Tìm thấy <span className="font-semibold text-green-600 dark:text-green-400">{fields.length}</span> sân phù hợp
                      </p>
                    </div>
                    
                    {fields.length > 0 && (
                      <div className="mt-3 md:mt-0">
                        <span className="inline-flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                          <i className="fas fa-check-circle mr-2 text-xs"></i>
                          Có sẵn ngay
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Search Summary */}
                  {/* {searchInfo && (
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <i className="fas fa-filter text-blue-500 text-sm"></i>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">Bộ lọc đã chọn:</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                          <i className="fas fa-calendar mr-1"></i>
                          {formatDateForDisplay(searchInfo.date)}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
                          <i className="fas fa-clock mr-1"></i>
                          {searchInfo.startTime} - {searchInfo.endTime} ({getDuration()})
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md">
                          <i className="fas fa-futbol mr-1"></i>
                          {getFieldTypeLabels(searchInfo.fieldTypes)}
                        </span>
                      </div>
                    </div>
                  )} */}
                </div>
              )}
            </div>

            {/* Results Grid */}
            {searchPerformed && (
              <div className="transition-all duration-500">
                {fields.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {fields.map((field, index) => (
                      <FieldCard
                        key={field.id}
                        field={field}
                        searchInfo={searchInfo}
                        onBook={handleBook}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-search text-gray-400 text-3xl"></i>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Không tìm thấy sân phù hợp
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm md:text-base">
                      Hiện tại không có sân nào trống trong khung thời gian bạn chọn. Hãy thử:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-sm">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <i className="fas fa-clock text-blue-500 mb-2"></i>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Thay đổi giờ</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">Chọn khung giờ khác</div>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <i className="fas fa-calendar text-green-500 mb-2"></i>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Chọn ngày khác</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">Thử ngày khác</div>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <i className="fas fa-futbol text-purple-500 mb-2"></i>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Thay loại sân</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">Chọn thêm loại sân</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 md:py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Tại sao chọn chúng tôi?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                Những ưu điểm vượt trội khi đặt sân tại hệ thống của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: 'fas fa-bolt',
                  title: 'Đặt sân nhanh chóng',
                  description: 'Tìm và đặt sân chỉ trong vài phút với giao diện thân thiện',
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  icon: 'fas fa-shield-check',
                  title: 'Đảm bảo chất lượng',
                  description: 'Tất cả sân đều được kiểm tra và đảm bảo chất lượng tốt nhất',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: 'fas fa-headset',
                  title: 'Hỗ trợ 24/7',
                  description: 'Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn',
                  color: 'from-blue-500 to-blue-600'
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mr-3`}>
                      <i className={`${feature.icon} text-white text-lg`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 text-lg">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      {selected && (
        <BookingModal
          field={selected.field}
          slot={selected.slot}
          searchInfo={searchInfo}
          onClose={() => setSelected(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      <Footer />
      <LoginModal />
    </div>
  );
}

// FIXED: Ensure proper default export
export default Booking;