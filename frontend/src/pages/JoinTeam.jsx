// pages/JoinTeam.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JoinTeamCard from '../components/JoinTeamCard';
import JoinTeamModal from '../components/JoinTeamModal';
import ContactModal from '../components/ContactModal';
import LoginModal from '../components/LoginModal';
import { fetchTeamJoinPosts } from '../services/teamJoinService';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet';

function JoinTeam() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [contact, setContact] = useState(null);
  const [filter, setFilter] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetchTeamJoinPosts(filter);
      setPosts(res);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFilter = {};
    if (formData.get('date')) newFilter.date = formData.get('date');
    if (formData.get('time')) newFilter.time = formData.get('time');
    if (formData.get('field_type')) newFilter.field_type = formData.get('field_type');
    if (formData.get('level')) newFilter.level = formData.get('level');
    if (formData.get('position_needed')) newFilter.position_needed = formData.get('position_needed');
    setFilter(newFilter);
  };

  const clearFilter = () => {
    document.getElementById('filter-form').reset();
    setFilter({});
  };

  const handleCreateClick = () => {
    if (!user) {
      const modal = document.getElementById('login-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      return;
    }
    setShowModal(true);
  };

  const getFilterLabel = (key, value) => {
    const labels = {
      date: new Date(value).toLocaleDateString('vi-VN'),
      time: value,
      field_type: value === '5vs5' ? 'Sân 5v5' : value === '7vs7' ? 'Sân 7v7' : 'Sân 11v11',
      level: value === 'beginner' ? 'Mới chơi' : value === 'intermediate' ? 'Trung bình' : value === 'advanced' ? 'Khá' : 'Giỏi',
      position_needed: value === 'goalkeeper' ? 'Thủ môn' : value === 'defender' ? 'Hậu vệ' : value === 'midfielder' ? 'Tiền vệ' : value === 'forward' ? 'Tiền đạo' : 'Bất kỳ'
    };
    return labels[key] || value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      
      <Helmet>
        <title>Tham gia ghép đội - TaZiFootball</title>
        <meta name="description" content="Tìm đồng đội và tham gia đá ké nhanh chóng tiện lợi." />
      </Helmet>
      
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-300 via-green-100 to-emerald-200 dark:from-gray-800 dark:via-green-800 dark:to-emerald-900 overflow-hidden">
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
                <span className="text-xs font-medium text-green-800">Tìm đồng đội hoàn hảo</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-green-800 dark:text-white">
                Ghép đội{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  bóng đá
                </span>
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-green-700 dark:text-green-100 max-w-2xl mx-auto leading-relaxed">
                Tìm đồng đội hoặc xin đá ké khi thiếu người, kết nối cộng đồng bóng đá
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6 md:mt-8 mb-4 max-w-md mx-auto">
                <div className="text-center bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-3">
                  <div className="text-lg md:text-xl font-bold text-green-800">{posts.length}</div>
                  <div className="text-xs text-green-700">Đội cần người</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-3">
                  <div className="text-lg md:text-xl font-bold text-green-800">24/7</div>
                  <div className="text-xs text-green-700">Hoạt động</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-3">
                  <div className="text-lg md:text-xl font-bold text-green-800">100%</div>
                  <div className="text-xs text-green-700">Miễn phí</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Actions Section */}
        <section className="relative -mt-8 md:-mt-12 pb-6">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleCreateClick}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm"
                  >
                    <i className="fas fa-plus text-xs"></i>
                    <span>Đăng tin ghép đội</span>
                  </button>
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className={`flex-1 sm:flex-none py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm ${
                      showFilter
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className="fas fa-filter text-xs"></i>
                    <span>{showFilter ? 'Ẩn bộ lọc' : 'Bộ lọc'}</span>
                  </button>
                </div>
                {showFilter && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 transition-all duration-300">
                    <form id="filter-form" onSubmit={handleFilterSubmit} className="space-y-4">
                      <div className="flex gap-3">
                        <div className='flex-1 spacy-y-2'>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ngày
                          </label>
                          <input
                            type="date"
                            name="date"
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                          />
                        </div>
                        <div className='flex-1 spacy-y-2'>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Giờ
                          </label>
                          <select
                            name="time"
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                          >
                            <option value="">Tất cả</option>
                            {Array.from({length: 16}, (_, i) => {
                              const h = i + 6;
                              return <option key={h} value={`${h.toString().padStart(2,'0')}:00`}>{h}:00</option>;
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className='flex-1 spacy-y-2'>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Loại sân
                          </label>
                          <select
                            name="field_type"
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                          >
                            <option value="">Tất cả</option>
                            <option value="5vs5">Sân 5 người</option>
                            <option value="7vs7">Sân 7 người</option>
                            <option value="11vs11">Sân 11 người</option>
                          </select>
                        </div>
                        <div className='flex-1 spacy-y-2'>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Trình độ
                          </label>
                          <select
                            name="level"
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                          >
                            <option value="">Tất cả</option>
                            <option value="beginner">Mới chơi</option>
                            <option value="intermediate">Trung bình</option>
                            <option value="advanced">Khá</option>
                            <option value="pro">Giỏi</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Vị trí cần
                        </label>
                        <select
                          name="position_needed"
                          className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                        >
                          <option value="">Tất cả</option>
                          <option value="goalkeeper">Thủ môn</option>
                          <option value="defender">Hậu vệ</option>
                          <option value="midfielder">Tiền vệ</option>
                          <option value="forward">Tiền đạo</option>
                          <option value="any">Vị trí bất kỳ</option>
                        </select>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300">
                          Tìm kiếm
                        </button>
                        <button type="button" onClick={clearFilter} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                          Xóa bộ lọc
                        </button>
                      </div>
                      {Object.keys(filter).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          {Object.entries(filter).map(([key, value]) => (
                            <span key={key} className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {getFilterLabel(key, value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Teams Section */}
        <section className="teams-section py-6 md:py-8">
          <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="teams-header flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Danh sách đội cần ghép</h2>
              <div className="teams-count text-sm text-gray-600 dark:text-gray-400">
                Tìm thấy {posts.length} đội bóng
              </div>
            </div>
            
            {/* Updated grid: 4 columns layout */}
            <div className="teams-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : posts.length > 0 ? (
                posts.map((p, idx) => (
                  <JoinTeamCard key={p.id} post={p} onContact={setContact} index={idx} />
                ))
              ) : (
                <div className="col-span-full no-teams flex flex-col items-center py-12">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-search text-purple-400 text-3xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Không tìm thấy đội nào</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Thử đăng tin ghép đội mới</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      {showModal && <JoinTeamModal onClose={() => setShowModal(false)} onRefresh={loadPosts} />}
      {contact && <ContactModal data={contact} onClose={() => setContact(null)} />}
      <Footer />
      <LoginModal />
    </div>
  );
}

export default JoinTeam;