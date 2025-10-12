import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import axios from 'axios';
import { Helmet } from 'react-helmet';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'booking',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/contact', form);
      setStatus({ type: 'success', message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.' });
      setForm({ name: '', email: '', subject: 'booking', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Gửi thất bại. Vui lòng thử lại sau hoặc liên hệ trực tiếp.' });
    } finally {
      setIsSubmitting(false);
      // Auto hide status after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Địa chỉ',
      content: '16 TL03, Thạnh Lộc, Q.12, TP.HCM',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      link: 'https://maps.google.com/?q=16+TL03+Thạnh+Lộc+Quận+12+TP+HCM'
    },
    {
      icon: 'fas fa-phone',
      title: 'Hotline',
      content: '0868 713 558',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      link: 'tel:0868713558'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      content: 'nguyenthanhtam10062004@gmail.com',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      link: 'mailto:nguyenthanhtam10062004@gmail.com'
    },
    {
      icon: 'fas fa-clock',
      title: 'Giờ làm việc',
      content: 'T2-T6: 06:00-22:00\nT7-CN: 06:00-23:00',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook',
      url: 'https://facebook.com/thanhtam.100604',
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Instagram',
      icon: 'fab fa-instagram',
      url: 'https://instagram.com/thtam_10604',
      color: 'hover:bg-pink-600'
    },
    {
      name: 'TikTok',
      icon: 'fab fa-tiktok',
      url: '#',
      color: 'hover:bg-gray-900'
    },
    {
      name: 'YouTube',
      icon: 'fab fa-youtube',
      url: '#',
      color: 'hover:bg-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      
      <Helmet>
        <title>Liên hệ - TaZiFootball</title>
        <meta name="description" content="Liên hệ với chúng tôi để được hỗ trợ tốt nhất." />
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
            <div className="absolute top-1/2 right-10 w-20 h-20 bg-blue-300 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
            <div className="absolute bottom-10 left-20 w-16 h-16 bg-teal-300 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 md:py-12">
            <div className={`text-center text-green-800 dark:text-white transition-all duration-700 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-green-200 rounded-full px-3 py-1.5 mb-4">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-800">Luôn sẵn sàng hỗ trợ bạn</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-green-800 dark:text-white">
                Liên hệ{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  với chúng tôi
                </span>
              </h1>
              
              <p className="text-sm md:text-base lg:text-lg text-green-700 dark:text-green-100 max-w-2xl mx-auto leading-relaxed">
                Mọi thắc mắc, góp ý hoặc hỗ trợ, chúng tôi luôn sẵn sàng lắng nghe bạn
              </p>

              {/* Quick Contact */}
              <div className="grid grid-cols-2 gap-4 mt-6 md:mt-8 max-w-md mx-auto">
                <a
                  href="tel:0868713558"
                  className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-3 hover:bg-white/80 transition-all duration-300"
                >
                  <i className="fas fa-phone text-green-600"></i>
                  <span className="text-sm font-medium text-green-800">Gọi ngay</span>
                </a>
                <a
                  href="mailto:nguyenthanhtam10062004@gmail.com"
                  className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-3 hover:bg-white/80 transition-all duration-300"
                >
                  <i className="fas fa-envelope text-blue-600"></i>
                  <span className="text-sm font-medium text-green-800">Gửi email</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            
            {/* Contact Info Cards */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 transition-all duration-700 delay-200 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${info.icon} ${info.color} text-lg`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {info.title}
                    </h3>
                  </div>
                  
                  {info.link ? (
                    <a
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 text-sm leading-relaxed block"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                      {info.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              
              {/* Contact Form */}
              <div className={`transition-all duration-700 delay-400 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-paper-plane text-white"></i>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Gửi tin nhắn
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Chúng tôi sẽ phản hồi trong 24h
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                          placeholder="Nhập họ và tên"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                          placeholder="Nhập email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Chủ đề *
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                      >
                        <option value="booking">Đặt sân</option>
                        <option value="feedback">Góp ý</option>
                        <option value="complaint">Khiếu nại</option>
                        <option value="partner">Hợp tác</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nội dung *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm resize-none"
                        placeholder="Nhập nội dung tin nhắn..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i>
                          <span>Gửi tin nhắn</span>
                        </>
                      )}
                    </button>

                    {status && (
                      <div className={`p-4 rounded-lg ${
                        status.type === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                          <span className="text-sm">{status.message}</span>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Info & Social */}
              <div className={`space-y-6 transition-all duration-700 delay-600 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
                
                {/* Additional Info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                    <i className="fas fa-info-circle mr-3 text-blue-500"></i>
                    Thông tin thêm
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-clock text-green-500 mt-1"></i>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Thời gian phản hồi</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Trong vòng 2-24 giờ</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-language text-purple-500 mt-1"></i>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Ngôn ngữ hỗ trợ</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Tiếng Việt, English</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-headset text-orange-500 mt-1"></i>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Hỗ trợ khẩn cấp</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Gọi hotline 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                    <i className="fas fa-share-alt mr-3 text-pink-500"></i>
                    Kết nối với chúng tôi
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${social.color}`}
                      >
                        <i className={`${social.icon}`}></i>
                        <span className="text-sm font-medium">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className={`py-8 md:py-12 bg-white/50 dark:bg-gray-900/50 transition-all duration-700 delay-800 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Vị trí của chúng tôi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Đến trực tiếp để trải nghiệm dịch vụ tốt nhất
              </p>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.363581788153!2d106.68094251032075!3d10.859926457603919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529fb7fc7aa8b%3A0x2d547093695adcdb!2zTmluYSBIb3VzZSBUaOG6oW5oIEzhu5lj!5e0!3m2!1svi!2s!4v1754792866878!5m2!1svi!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}

export default Contact;