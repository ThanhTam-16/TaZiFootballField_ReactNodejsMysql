import { useToast } from '../hooks/useToast';

function ContactModal({ data, onClose }) {
  if (!data) return null;

  const { showSuccess } = useToast();
  const handleCall = () => {
    window.open(`tel:${data.phone}`, '_self');
  };

  const handleZalo = () => {
    window.open(`https://zalo.me/${data.phone}`, '_blank');
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(data.phone).then(() => {
      showSuccess('Đã sao chép số điện thoại!');
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-address-book text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Thông tin liên hệ</h3>
                <p className="text-green-100 text-sm">Kết nối ngay với người chơi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <i className="fas fa-times text-white"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Contact Info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-user text-white text-lg"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {data.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Người liên hệ
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-phone text-white text-lg"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {data.phone}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Số điện thoại
                </p>
              </div>
              <button
                onClick={copyPhone}
                className="w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                title="Sao chép số"
              >
                <i className="fas fa-copy text-gray-600 dark:text-gray-400"></i>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCall}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <i className="fas fa-phone"></i>
              <span>Gọi điện</span>
            </button>

            <button
              onClick={handleZalo}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <i className="fab fa-facebook-messenger"></i>
              <span>Nhắn tin Zalo</span>
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <i className="fas fa-times"></i>
              <span>Đóng</span>
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-start space-x-3">
              <i className="fas fa-lightbulb text-yellow-500 mt-0.5"></i>
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm mb-1">
                  Mẹo liên hệ hiệu quả:
                </h4>
                <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Giới thiệu bản thân và mục đích liên hệ</li>
                  <li>• Xác nhận thời gian và địa điểm trước khi đến</li>
                  <li>• Hỏi về trình độ và phong cách chơi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;