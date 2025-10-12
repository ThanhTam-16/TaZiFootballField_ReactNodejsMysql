import { useState, useEffect } from 'react';
import { sendOtp, verifyOtp, adminLogin } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginModal() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [loginType, setLoginType] = useState('customer'); // 'customer' hoặc 'admin'
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: OTP (customer only)
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Timer effect for OTP
  useEffect(() => {
    let countdown;
    if (step === 2 && timer > 0 && loginType === 'customer') {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [step, timer, loginType]);

  // Modal controls
  useEffect(() => {
    const modal = document.getElementById('login-modal');
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      resetForm();
    };

    const closeBtn = modal.querySelector('.close-modal');
    const outsideClick = (e) => {
      if (e.target === modal) closeModal();
    };

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', outsideClick);

    return () => {
      closeBtn?.removeEventListener('click', closeModal);
      modal?.removeEventListener('click', outsideClick);
    };
  }, []);

  const resetForm = () => {
    setEmailOrPhone('');
    setPassword('');
    setOtp('');
    setStep(1);
    setTimer(60);
    setIsLoading(false);
    setShowPassword(false);
  };

  const switchLoginType = (type) => {
    setLoginType(type);
    resetForm();
  };

  // Customer OTP Login
  const handleSendOtp = async () => {
    if (!emailOrPhone.trim()) {
      alert('Vui lòng nhập email hoặc số điện thoại');
      return;
    }
    
    setIsLoading(true);
    try {
      await sendOtp(emailOrPhone);
      setStep(2);
      setTimer(60);
    } catch (err) {
      console.error(err);
      alert('Không gửi được OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert('Vui lòng nhập mã OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await verifyOtp(emailOrPhone, otp);
      login(res.data.user);
      
      const modal = document.getElementById('login-modal');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
      
      if (!res.data.user.name || res.data.user.name.trim().toLowerCase() === 'người dùng mới') {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      alert('Mã OTP không đúng hoặc đã hết hạn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtpKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendOtp();
    }
  }

  const handleVerifyOtpKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  }

  const handleAdminLoginKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  }

  // Admin Login - FIXED VERSION
  const handleAdminLogin = async () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Attempting admin login with:', emailOrPhone);
      
      // Call real admin login API
      const response = await adminLogin(emailOrPhone, password);
      
      console.log('Admin login response:', response);
      
      // Store admin session
      localStorage.setItem('adminToken', response.sessionToken);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));
      
      // Close modal
      const modal = document.getElementById('login-modal');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
      
      // Force page reload to ensure AdminContext picks up the new token
      window.location.href = '/admin/dashboard';
      
      alert('Đăng nhập admin thành công!');
    } catch (err) {
      console.error('Admin login error:', err);
      
      // More specific error handling
      if (err.response?.status === 401) {
        alert('Email hoặc mật khẩu không đúng');
      } else if (err.response?.status === 400) {
        alert('Thông tin đăng nhập không hợp lệ');
      } else {
        alert('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    setTimer(60);
    handleSendOtp();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 opacity-0 invisible transition-all duration-300" id="login-modal">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md transform scale-95 transition-all duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <i className={`fas ${loginType === 'admin' ? 'fa-shield-alt' : 'fa-user'} text-white text-sm`}></i>
              </div>
              <h3 className="text-lg font-bold text-white">
                {loginType === 'admin' ? 'Đăng nhập Admin' : 'Đăng nhập'}
              </h3>
            </div>
            <button className="close-modal w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200">
              <i className="fas fa-times text-white text-sm"></i>
            </button>
          </div>
        </div>

        {/* Login Type Switcher */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => switchLoginType('customer')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                loginType === 'customer'
                  ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <i className="fas fa-user mr-2 text-xs"></i>
              Khách hàng
            </button>
            <button
              onClick={() => switchLoginType('admin')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                loginType === 'admin'
                  ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <i className="fas fa-shield-alt mr-2 text-xs"></i>
              Quản trị
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4">
          {loginType === 'customer' ? (
            // Customer Login Form
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email hoặc số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-gray-400 text-sm"></i>
                      </div>
                      <input
                        type="text"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Nhập email hoặc số điện thoại"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                        disabled={isLoading}
                        onKeyDown={handleSendOtpKeyDown}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading || !emailOrPhone.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang gửi OTP...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane text-xs"></i>
                        <span>Gửi mã OTP</span>
                      </>
                    )}
                  </button>
                  {/* Demo Account Info */}
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">
                      <i className="fas fa-info-circle mr-1"></i>
                      Lưu ý:
                    </p>
                    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <div>Website đang trong quá trình phát triển nên chỉ hỗ trợ đăng nhập bằng email</div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-mobile-alt text-green-600 dark:text-green-400 text-lg"></i>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mã OTP đã được gửi đến
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {emailOrPhone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mã OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Nhập mã 6 số"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-center text-lg font-mono tracking-widest"
                      maxLength="6"
                      disabled={isLoading}
                      onKeyDown={handleVerifyOtpKeyDown}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Mã hết hạn sau: <span className="font-bold text-green-600 dark:text-green-400">{timer}s</span>
                    </span>
                    {timer === 0 && (
                      <button
                        onClick={resendOtp}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                      >
                        Gửi lại
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || !otp.trim() || otp.length !== 6}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Đang xác minh...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt text-xs"></i>
                          <span>Đăng nhập</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setStep(1)}
                      className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
                    >
                      <i className="fas fa-arrow-left mr-2 text-xs"></i>
                      Quay lại
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Admin Login Form - UPDATED
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400 text-sm"></i>
                  </div>
                  <input
                    type="email"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="admin@footballfield.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                    disabled={isLoading}
                    onKeyDown={handleAdminLoginKeyDown}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400 text-sm"></i>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                    disabled={isLoading}
                    onKeyDown={handleAdminLoginKeyDown}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm`}></i>
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdminLogin}
                disabled={isLoading || !emailOrPhone.trim() || !password.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-shield-alt text-xs"></i>
                    <span>Đăng nhập Admin</span>
                  </>
                )}
              </button>

              {/* Demo Account Info */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">
                  <i className="fas fa-info-circle mr-1"></i>
                  Tài khoản demo:
                </p>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <div>Email: admin@footballfield.com</div>
                  <div>Mật khẩu: admin</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        #login-modal.active {
          opacity: 1;
          visibility: visible;
        }
        
        #login-modal.active > div {
          transform: scale(1);
        }
      `}</style>
    </div>
  );
}

export default LoginModal;