import { useState, useEffect } from 'react';

function Features() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('features-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: 'fas fa-calendar-check',
      title: 'Đặt sân dễ dàng',
      description: 'Không cần tài khoản phức tạp, chỉ cần số điện thoại và OTP',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      delay: '0ms'
    },
    {
      icon: 'fas fa-futbol',
      title: 'Đa dạng sân bóng',
      description: 'Nhiều loại sân phù hợp với nhu cầu của bạn từ 5v5 đến 11v11',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      delay: '100ms'
    },
    {
      icon: 'fas fa-users',
      title: 'Tìm kèo & ghép đội',
      description: 'Dễ dàng tìm đối thủ hoặc tham gia vào các đội đang thiếu người',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      delay: '200ms'
    },
    {
      icon: 'fas fa-money-bill-wave',
      title: 'Thanh toán linh hoạt',
      description: 'Hỗ trợ thanh toán tiền mặt và trực tuyến, giá cả minh bạch',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      delay: '300ms'
    }
  ];

  return (
    <section id="features-section" className="py-8 lg:py-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className={`transition-all duration-700 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
              Tại sao chọn{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                chúng tôi?
              </span>
            </h2>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              Chúng tôi mang đến trải nghiệm đặt sân bóng tốt nhất với những tính năng vượt trội
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group hover-lift transition-all duration-700 ${
                isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                animationDelay: isVisible ? feature.delay : '0ms',
                transitionDelay: isVisible ? feature.delay : '0ms'
              }}
            >
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                  <div className={`w-full h-full bg-gradient-to-br ${feature.color} rounded-bl-full`}></div>
                </div>

                {/* Icon */}
                <div className="relative mb-3 md:mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${feature.icon} text-base md:text-lg bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}></i>
                  </div>
                  
                  {/* Floating dots */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-bounce-subtle"></div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs md:text-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action - UPDATED: Màu pastel nhẹ nhàng hơn */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${
          isVisible ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-green-200 via-emerald-150 to-green-200 dark:from-green-800/80 dark:via-emerald-800/80 dark:to-green-800/80 rounded-xl p-6 md:p-8 text-green-800 dark:text-white relative overflow-hidden">
            {/* Background Pattern - Adjusted for lighter colors */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10">
              <div className="absolute top-2 left-2 w-20 h-20 border border-green-400 dark:border-white rounded-full"></div>
              <div className="absolute bottom-2 right-2 w-16 h-16 border border-emerald-400 dark:border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-teal-400 dark:border-white rounded-full"></div>
            </div>

            <div className="relative">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-green-800 dark:text-white">Sẵn sàng đặt sân bóng?</h3>
              <p className="text-green-700 dark:text-green-100 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
                Tham gia cùng hàng ngàn người chơi khác và trải nghiệm dịch vụ đặt sân tốt nhất
              </p>
              <a
                href="/booking"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>Đặt sân ngay</span>
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;