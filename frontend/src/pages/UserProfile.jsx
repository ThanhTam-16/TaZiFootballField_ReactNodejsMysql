import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserPostsManagement from '../components/UserPostsManagement';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { Helmet } from 'react-helmet';

function UserProfile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone_number: '' });
  const [stats, setStats] = useState({ total: 0, cancelled: 0, completed: 0, total_spent: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [actionLoading, setActionLoading] = useState({}); // Track loading state for individual actions
  const bookingInfo = location.state?.bookingInfo;

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
      fetchBookingHistory();
    } else if (user?.phone_number) {
      setForm({
        name: '',
        email: '',
        phone_number: user.phone_number,
      });
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const res = await API.get(`/users/${user.id}`);
      setForm({
        name: res.data.name || '',
        email: res.data.email || '',
        phone_number: res.data.phone_number || user.phone_number || '',
      });
      setStats({
        total: res.data.total_bookings || 0,
        cancelled: res.data.cancelled_bookings || 0,
        completed: res.data.completed_bookings || 0,
        total_spent: res.data.total_spent || 0,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setForm({
        name: '',
        email: '',
        phone_number: user.phone_number || '',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const res = await API.get(`/bookings/user/${user.id}`);
      setBookings(res.data || []);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      setBookings([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Vui lòng nhập tên');
      return;
    }
    
    setUpdating(true);
    try {
      await API.put(`/users/${user.id}`, {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number || '',
      });

      const res = await API.get(`/users/${user.id}`);
      login(res.data);
      setForm({
        name: res.data.name || '',
        email: res.data.email || '',
        phone_number: res.data.phone_number || user.phone_number || '',
      });
      
      alert('Cập nhật thành công');
      if (bookingInfo) {
        navigate('/booking', { state: { bookingInfo } });
      }
    } catch (err) {
      alert('Lỗi khi cập nhật: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'approved': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ xác nhận';
      default: return 'Không xác định';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'  
    });
  };

  // ...existing code...

  // FIXED: Add cancel booking handler (removed "notes: 'Hủy bởi khách hàng'")
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đặt sân này?')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [`cancel-${bookingId}`]: true }));
    
    try {
      // Call API to cancel booking (no notes sent)
      await API.put(`/bookings/user/${bookingId}/cancel`, {
        status: 'cancelled'
      });
      
      alert('Hủy đặt sân thành công');
      
      // Refresh data
      await fetchUserData();
      await fetchBookingHistory();
      
    } catch (error) {
      console.error('Cancel booking error:', error);
      alert('Lỗi khi hủy đặt sân: ' + (error.response?.data?.error || error.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [`cancel-${bookingId}`]: false }));
    }
  };


  // FIXED: Add rebook handler  
  const handleRebook = (booking) => {
    navigate('/booking', { 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-emerald-200 dark:from-gray-900 dark:to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-slash text-white text-2xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 dark:text-gray-400">Bạn cần đăng nhập để xem trang cá nhân</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900">
        
        <Helmet>
        <title>Hồ sơ cá nhân - TaZiFootball</title>
        <meta name="description" content="Xem và chỉnh sửa thông tin cá nhân của bạn." />
        </Helmet>
        
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900">
      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-500 to-green-600 dark:from-gray-800 dark:to-green-800 text-white py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-xl md:text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold">
                    {user.name || 'Người dùng mới'}
                  </h1>
                  <p className="text-green-100 mt-1 text-sm">
                    <i className="fas fa-phone mr-2"></i>
                    {user.phone_number}
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-lg md:text-xl font-bold">{stats.total}</div>
                  <div className="text-xs text-green-100">Tổng đặt</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-lg md:text-xl font-bold">{stats.completed}</div>
                  <div className="text-xs text-green-100">Hoàn thành</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-lg md:text-xl font-bold">{stats.cancelled}</div>
                  <div className="text-xs text-green-100">Đã hủy</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-lg md:text-xl font-bold">{formatCurrency(stats.total_spent).replace('₫', '₫')}</div>
                  <div className="text-xs text-green-100">Tổng chi</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-300 ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <i className="fas fa-user mr-2"></i>
                
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-300 ${
                  activeTab === 'history'
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <i className="fas fa-history mr-2"></i>
               
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-300 ${
                activeTab === 'posts'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              >
                <i className="fas fa-clipboard-list mr-2"></i>
                
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-edit text-white text-sm"></i>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                      Cập nhật thông tin
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={form.phone_number}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300 text-sm"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>

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
                          className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300 text-sm"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300 text-sm"
                        placeholder="Nhập email (tùy chọn)"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                      >
                        {updating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Đang cập nhật...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i>
                            <span>Lưu thay đổi</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                            logout();
                            navigate('/');
                          }
                        }}
                        className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                    Lịch sử đặt sân
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {bookings.length} đơn đặt sân
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar-times text-gray-400 text-xl md:text-2xl"></i>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Chưa có lịch sử đặt sân
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                      Bạn chưa đặt sân nào. Hãy bắt đầu đặt sân để xem lịch sử tại đây.
                    </p>
                    <a
                      href="/booking"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm"
                    >
                      <i className="fas fa-calendar-plus"></i>
                      <span>Đặt sân ngay</span>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                <i className="fas fa-futbol text-white text-sm"></i>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                                  {booking.field_name || `Sân #${booking.field_id}`}
                                </h3>
                                <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                  <span>
                                    <i className="fas fa-calendar mr-1"></i>
                                    {formatDate(booking.booking_date)}
                                  </span>
                                  <span>
                                    <i className="fas fa-clock mr-1"></i>
                                    {booking.start_time} - {booking.end_time}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                              <span className={`px-2 md:px-3 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                <i className="fas fa-money-bill-wave mr-1"></i>
                                {formatCurrency(booking.total_amount)}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                <i className="fas fa-credit-card mr-1"></i>
                                {booking.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                              </span>
                            </div>

                            
                          </div>

                          <div className="mt-3 md:mt-0 md:ml-4 flex  sm:flex-row gap-2">
                            {/* Cancel Button - Only show for pending/approved bookings */}
                            {(booking.status === 'pending' || booking.status === 'approved') && (
                              <button 
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={actionLoading[`cancel-${booking.id}`]}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center  space-x-1"
                              >
                                {actionLoading[`cancel-${booking.id}`] ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600"></div>
                                    <span>Đang hủy...</span>
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-times"></i>
                                    <span>Hủy đặt</span>
                                  </>
                                )}
                              </button>
                            )}
                            {/* Rebook Button - Always show */}
                            <button 
                              onClick={() => handleRebook(booking)}
                              className="px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-300 text-xs font-medium flex items-center space-x-1"
                            >
                              <i className="fas fa-redo"></i>
                              <span>Đặt lại</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div>
                <div className="mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                    Quản lý Kèo & Ghép đội
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Quản lý các kèo và tin ghép đội bạn đã đăng
                  </p>
                </div>
                <UserPostsManagement />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default UserProfile;