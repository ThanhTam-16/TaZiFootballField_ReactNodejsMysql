import logo from '../assets/images/logo.png';

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Đặt sân', href: '/booking' },
    { name: 'Tìm kèo', href: '/find-match' },
    { name: 'Ghép đội', href: '/join-team' },
    { name: 'Liên hệ', href: '/contact' }
  ];

  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      text: '16 TL03 p.Thạnh Lộc q.12 tp.Hồ Chí Minh',
      link: 'https://maps.google.com/?q=16+TL03+Thạnh+Lộc+Quận+12+TP+HCM'
    },
    {
      icon: 'fas fa-phone',
      text: '0868 713 558',
      link: 'tel:0868713558'
    },
    {
      icon: 'fas fa-envelope',
      text: 'nguyenthanhtam10062004@gmail.com',
      link: 'mailto:nguyenthanhtam10062004@gmail.com'
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook',
      href: 'https://facebook.com/thanhtam.100604',
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Instagram', 
      icon: 'fab fa-instagram',
      href: 'https://instagram.com/thtam_10604',
      color: 'hover:bg-pink-600'
    },
    {
      name: 'TikTok',
      icon: 'fab fa-tiktok',
      href: '#',
      color: 'hover:bg-gray-900'
    },
    {
      name: 'YouTube',
      icon: 'fab fa-youtube',
      href: '#',
      color: 'hover:bg-red-600'
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-white rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-6 h-6 md:w-10 md:h-10  rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <img src={logo} alt="logo" className='w-full h-full object-cover' />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  TaZiFootball
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Đặt sân bóng nhanh chóng và thuận tiện. Nền tảng hàng đầu cho cộng đồng bóng đá Việt Nam.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-green-400">50+</div>
                  <div className="text-xs text-gray-400">Sân bóng</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-green-400">1000+</div>
                  <div className="text-xs text-gray-400">Người dùng</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 relative">
                Liên kết nhanh
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-green-400"></div>
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <i className="fas fa-chevron-right text-xs text-green-500 group-hover:translate-x-1 transition-transform duration-300"></i>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 relative">
                Thông tin liên hệ
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-green-400"></div>
              </h4>
              <ul className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <li key={index}>
                    <a 
                      href={contact.link}
                      className="flex items-start space-x-3 text-gray-300 hover:text-green-400 transition-colors duration-300 group"
                    >
                      <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                        <i className={`${contact.icon} text-green-500 group-hover:scale-110 transition-transform duration-300`}></i>
                      </div>
                      <span className="text-sm leading-relaxed">{contact.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6 relative">
                Kết nối với chúng tôi
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-green-400"></div>
              </h4>
              
              {/* Social Links */}
              <div className="flex space-x-3 mb-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-white/10 hover:bg-white/20 ${social.color} rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 border border-white/20`}
                    title={social.name}
                  >
                    <i className={`${social.icon} text-sm`}></i>
                  </a>
                ))}
              </div>

              {/* Newsletter */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h5 className="font-medium mb-3 text-green-400">Đăng ký nhận tin</h5>
                <p className="text-xs text-gray-400 mb-3">
                  Nhận thông báo về các sân mới và ưu đãi đặc biệt
                </p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded text-white text-sm font-medium hover:shadow-lg transition-all duration-300">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
               © {currentYear} Nguyễn Thành Tâm. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
              <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-300">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-300">
                Điều khoản sử dụng
              </a>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Made with</span>
                <i className="fas fa-heart text-red-500 animate-pulse"></i>
                <span>in Vietnam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;