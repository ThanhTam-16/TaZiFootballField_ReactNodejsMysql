import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMatches } from '../services/matchService';
import { fetchTeamJoinPosts, updateTeamJoinPost, deleteTeamJoinPost } from '../services/teamJoinService';
import API from '../services/api';

function UserPostsManagement() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [teamPosts, setTeamPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  // Collapsible states - Mặc định mở và hiển thị tin chưa hoàn thành
  const [matchesExpanded, setMatchesExpanded] = useState(true);
  const [teamPostsExpanded, setTeamPostsExpanded] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const allMatches = await fetchMatches();
      const userMatches = allMatches.filter(m => 
        m.creator_id === user.id || 
        (m.contact_phone && m.contact_phone === user.phone_number)
      );

      const allTeamPosts = await fetchTeamJoinPosts();
      const userTeamPosts = allTeamPosts.filter(p => 
        p.contact_phone && p.contact_phone === user.phone_number
      );

      setMatches(userMatches);
      setTeamPosts(userTeamPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMatch = async (matchId) => {
    if (!confirm('Đánh dấu trận đấu này đã hoàn thành?')) return;
    
    setActionLoading(prev => ({ ...prev, [`complete-match-${matchId}`]: true }));
    try {
      await API.put(`/matches/${matchId}/status`, { 
        status: 'completed',
        user_id: user.id,
        phone_number: user.phone_number
      });
      await fetchUserPosts();
      alert('Đã đánh dấu hoàn thành trận đấu');
    } catch (error) {
      console.error('Error completing match:', error);
      alert(error.response?.data?.error || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setActionLoading(prev => ({ ...prev, [`complete-match-${matchId}`]: false }));
    }
  };

  const handleCancelMatch = async (matchId) => {
    if (!confirm('Hủy trận đấu này? Hành động không thể hoàn tác.')) return;
    
    setActionLoading(prev => ({ ...prev, [`cancel-match-${matchId}`]: true }));
    try {
      await API.delete(`/matches/${matchId}`, { 
        data: {
          user_id: user.id,
          phone_number: user.phone_number
        }
      });
      await fetchUserPosts();
      alert('Đã hủy trận đấu');
    } catch (error) {
      console.error('Error canceling match:', error);
      alert(error.response?.data?.error || 'Lỗi khi hủy trận đấu');
    } finally {
      setActionLoading(prev => ({ ...prev, [`cancel-match-${matchId}`]: false }));
    }
  };

  const handleCompleteTeamPost = async (postId) => {
  if (!confirm('Đánh dấu tin ghép đội này đã hoàn thành?')) return;
  
  setActionLoading(prev => ({ ...prev, [`complete-team-${postId}`]: true }));
  try {
    // 👇 GỌI TRỰC TIẾP API GIỐNG MATCH
    await API.put(`/team-joins/${postId}/status`, { 
      status: 'closed',
      phone_number: user.phone_number
    });
    
    alert('Đã đánh dấu hoàn thành tin ghép đội');
    
    // 👇 REFRESH DATA
    await fetchUserPosts();
    
  } catch (error) {
    console.error('Error completing team post:', error);
    alert(error.response?.data?.error || 'Lỗi khi cập nhật trạng thái');
  } finally {
    setActionLoading(prev => ({ ...prev, [`complete-team-${postId}`]: false }));
  }
};

  const handleDeleteTeamPost = async (postId) => {
    if (!confirm('Hủy tin ghép đội này? Hành động không thể hoàn tác.')) return;
    
    setActionLoading(prev => ({ ...prev, [`delete-team-${postId}`]: true }));
    try {
      await API.delete(`/team-joins/${postId}`, {
        data: { phone_number: user.phone_number }
      });
      await fetchUserPosts();
      alert('Đã hủy tin ghép đội');
    } catch (error) {
      console.error('Error deleting team post:', error);
      alert('Lỗi khi hủy tin');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-team-${postId}`]: false }));
    }
  };

  const openEditModal = (item, type) => {
    setEditModal({ item, type });
    if (type === 'match') {
      setEditForm({
        match_date: item.match_date?.split('T')[0],
        start_time: item.start_time,
        end_time: item.end_time,
        level: item.level,
        age_min: item.age_min,
        age_max: item.age_max,
        price_per_person: item.price_per_person,
        description: item.description,
        contact_name: item.contact_name,
        contact_phone: item.contact_phone
      });
    } else {
      setEditForm({
        match_date: item.match_date?.split('T')[0],
        start_time: item.start_time,
        level: item.level,
        players_needed: item.players_needed,
        position_needed: item.position_needed,
        description: item.description,
        contact_name: item.contact_name,
        contact_phone: item.contact_phone
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModal) return;

    const { item, type } = editModal;
    setActionLoading(prev => ({ ...prev, [`edit-${type}-${item.id}`]: true }));
    
    try {
      if (type === 'match') {
        await API.put(`/matches/${item.id}`, {
          ...editForm,
          user_id: user.id,
          phone_number: user.phone_number
        });
      } else {
        await updateTeamJoinPost(item.id, {
          ...editForm,
          phone_number: user.phone_number
        });
      }
      
      await fetchUserPosts();
      setEditModal(null);
      alert('Cập nhật thành công!');
    } catch (error) {
      console.error('Error updating:', error);
      alert(error.response?.data?.error || 'Lỗi khi cập nhật');
    } finally {
      setActionLoading(prev => ({ ...prev, [`edit-${type}-${item.id}`]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString?.slice(0, 5) || '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'closed': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      case 'open': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'closed': return 'Đã đóng';
      case 'open': return 'Đang mở';
      default: return 'Chờ xác nhận';
    }
  };

  const levelMap = {
    beginner: 'Mới chơi',
    intermediate: 'Trung bình',
    advanced: 'Khá',
    pro: 'Giỏi'
  };

  const positionMap = {
    goalkeeper: 'Thủ môn',
    defender: 'Hậu vệ',
    midfielder: 'Tiền vệ',
    forward: 'Tiền đạo',
    any: 'Bất kỳ'
  };

  // Filter: Mặc định hiển thị tin chưa hoàn thành (open status)
  const activeMatches = matches.filter(m => m.status === 'open');
  const completedMatches = matches.filter(m => m.status !== 'open');
  
  const activeTeamPosts = teamPosts.filter(p => p.status === 'open');
  const completedTeamPosts = teamPosts.filter(p => p.status !== 'open');

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* My Matches Section - Collapsible */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header - Clickable */}
        <button
          onClick={() => setMatchesExpanded(!matchesExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-futbol text-white"></i>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Kèo của tôi
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeMatches.length} kèo đang mở
                {completedMatches.length > 0 && `, ${completedMatches.length} đã kết thúc`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {matches.length} kèo
            </span>
            <i className={`fas fa-chevron-${matchesExpanded ? 'up' : 'down'} text-gray-400 transition-transform duration-200`}></i>
          </div>
        </button>

        {/* Content - Collapsible */}
        {matchesExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            {matches.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-futbol text-blue-400 text-xl"></i>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Chưa có kèo nào được tạo</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {/* Active Matches */}
                {activeMatches.length > 0 && (
                  <div className="space-y-3">
                    
                    {activeMatches.map((match) => (
                      <MatchCard 
                        key={match.id}
                        match={match}
                        onEdit={() => openEditModal(match, 'match')}
                        onComplete={() => handleCompleteMatch(match.id)}
                        onCancel={() => handleCancelMatch(match.id)}
                        actionLoading={actionLoading}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        levelMap={levelMap}
                      />
                    ))}
                  </div>
                )}

                {/* Completed Matches */}
                {completedMatches.length > 0 && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 px-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Đã kết thúc ({completedMatches.length})</h4>
                    </div>
                    {completedMatches.map((match) => (
                      <MatchCard 
                        key={match.id}
                        match={match}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        levelMap={levelMap}
                        isCompleted={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* My Team Posts Section - Collapsible */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header - Clickable */}
        <button
          onClick={() => setTeamPostsExpanded(!teamPostsExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-plus text-white"></i>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Tin ghép đội của tôi
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeTeamPosts.length} tin đang mở
                {completedTeamPosts.length > 0 && `, ${completedTeamPosts.length} đã đóng`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {teamPosts.length} tin
            </span>
            <i className={`fas fa-chevron-${teamPostsExpanded ? 'up' : 'down'} text-gray-400 transition-transform duration-200`}></i>
          </div>
        </button>

        {/* Content - Collapsible */}
        {teamPostsExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            {teamPosts.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-user-plus text-purple-400 text-xl"></i>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Chưa có tin ghép đội nào</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {/* Active Team Posts */}
                {activeTeamPosts.length > 0 && (
                  <div className="space-y-3">
                    
                    {activeTeamPosts.map((post) => (
                      <TeamPostCard 
                        key={post.id}
                        post={post}
                        onEdit={() => openEditModal(post, 'team')}
                        onComplete={() => handleCompleteTeamPost(post.id)}
                        onDelete={() => handleDeleteTeamPost(post.id)}
                        actionLoading={actionLoading}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        levelMap={levelMap}
                        positionMap={positionMap}
                      />
                    ))}
                  </div>
                )}

                {/* Completed Team Posts */}
                {completedTeamPosts.length > 0 && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 px-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Đã đóng ({completedTeamPosts.length})</h4>
                    </div>
                    {completedTeamPosts.map((post) => (
                      <TeamPostCard 
                        key={post.id}
                        post={post}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        levelMap={levelMap}
                        positionMap={positionMap}
                        isCompleted={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <EditModal 
          editModal={editModal}
          editForm={editForm}
          setEditForm={setEditForm}
          setEditModal={setEditModal}
          handleEditSubmit={handleEditSubmit}
          actionLoading={actionLoading}
          levelMap={levelMap}
          positionMap={positionMap}
        />
      )}
    </div>
  );
}

// Match Card Component
function MatchCard({ match, onEdit, onComplete, onCancel, actionLoading, formatDate, formatTime, getStatusColor, getStatusText, levelMap, isCompleted = false }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {match.field_type?.replace('vs', 'v')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                {match.field_name || `Sân ${match.field_type}`}
              </h4>
              <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                <span>
                  <i className="fas fa-calendar mr-1"></i>
                  {formatDate(match.match_date)}
                </span>
                <span>
                  <i className="fas fa-clock mr-1"></i>
                  {formatTime(match.start_time)} - {formatTime(match.end_time)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(match.status)}`}>
              {getStatusText(match.status)}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              <i className="fas fa-trophy mr-1"></i>
              {levelMap[match.level] || 'Trung bình'}
            </span>
            {match.price_per_person > 0 && (
              <span className="text-gray-600 dark:text-gray-400">
                <i className="fas fa-money-bill-wave mr-1"></i>
                {new Intl.NumberFormat('vi-VN').format(match.price_per_person)}đ/người
              </span>
            )}
          </div>
        </div>

        {!isCompleted && (
          <div className="mt-3 md:mt-0 md:ml-4 flex flex-wrap gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-300 text-xs font-medium flex items-center space-x-1"
            >
              <i className="fas fa-edit text-xs"></i>
              <span>Sửa</span>
            </button>
            
            <button
              onClick={onComplete}
              disabled={actionLoading[`complete-match-${match.id}`]}
              className="px-3 py-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-300 text-xs font-medium flex items-center space-x-1 disabled:opacity-50"
            >
              {actionLoading[`complete-match-${match.id}`] ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-green-600"></div>
              ) : (
                <i className="fas fa-check text-xs"></i>
              )}
              <span>Hoàn thành</span>
            </button>

            <button
              onClick={onCancel}
              disabled={actionLoading[`cancel-match-${match.id}`]}
              className="px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300 text-xs font-medium flex items-center space-x-1 disabled:opacity-50"
            >
              {actionLoading[`cancel-match-${match.id}`] ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600"></div>
              ) : (
                <i className="fas fa-times text-xs"></i>
              )}
              <span>Hủy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Team Post Card Component
function TeamPostCard({ post, onEdit, onComplete, onDelete, actionLoading, formatDate, formatTime, getStatusColor, getStatusText, levelMap, positionMap, isCompleted = false }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {post.field_type?.replace('vs', 'v')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                Tuyển {post.players_needed} người
              </h4>
              <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                <span>
                  <i className="fas fa-calendar mr-1"></i>
                  {formatDate(post.match_date)}
                </span>
                <span>
                  <i className="fas fa-clock mr-1"></i>
                  {formatTime(post.start_time)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(post.status)}`}>
              {getStatusText(post.status)}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              <i className="fas fa-trophy mr-1"></i>
              {levelMap[post.level] || 'Trung bình'}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              <i className="fas fa-running mr-1"></i>
              {positionMap[post.position_needed] || 'Bất kỳ'}
            </span>
          </div>
        </div>

        {!isCompleted && (
          <div className="mt-3 md:mt-0 md:ml-4 flex flex-wrap gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-300 text-xs font-medium flex items-center space-x-1"
            >
              <i className="fas fa-edit text-xs"></i>
              <span>Sửa</span>
            </button>
            
            <button
              onClick={onComplete}
              disabled={actionLoading[`complete-team-${post.id}`]}
              className="px-3 py-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-300 text-xs font-medium flex items-center space-x-1 disabled:opacity-50"
            >
              {actionLoading[`complete-team-${post.id}`] ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-green-600"></div>
              ) : (
                <i className="fas fa-check text-xs"></i>
              )}
              <span>Hoàn thành</span>
            </button>

            <button
              onClick={onDelete}
              disabled={actionLoading[`delete-team-${post.id}`]}
              className="px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300 text-xs font-medium flex items-center space-x-1 disabled:opacity-50"
            >
              {actionLoading[`delete-team-${post.id}`] ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600"></div>
              ) : (
                <i className="fas fa-times text-xs"></i>
              )}
              <span>Hủy tin</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Edit Modal Component
function EditModal({ editModal, editForm, setEditForm, setEditModal, handleEditSubmit, actionLoading, levelMap, positionMap }) {
  const timeOptions = [];
  for (let h = 6; h <= 21; h++) {
    timeOptions.push(`${h.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${h.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className={`bg-gradient-to-r ${editModal.type === 'match' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'} rounded-t-2xl p-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Chỉnh sửa {editModal.type === 'match' ? 'kèo' : 'tin ghép đội'}
            </h3>
            <button
              onClick={() => setEditModal(null)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center"
            >
              <i className="fas fa-times text-white"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày đá
              </label>
              <input
                type="date"
                value={editForm.match_date || ''}
                onChange={(e) => setEditForm({...editForm, match_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {editModal.type === 'match' ? 'Giờ bắt đầu' : 'Giờ đá'}
              </label>
              <select
                value={editForm.start_time || ''}
                onChange={(e) => setEditForm({...editForm, start_time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="">Chọn giờ</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {editModal.type === 'match' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Giờ kết thúc
                </label>
                <select
                  value={editForm.end_time || ''}
                  onChange={(e) => setEditForm({...editForm, end_time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="">Chọn giờ</option>
                  {timeOptions
                    .filter(time => editForm.start_time && time > editForm.start_time)
                    .map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Giá/người (VNĐ)
                </label>
                <input
                  type="number"
                  value={editForm.price_per_person || 0}
                  onChange={(e) => setEditForm({...editForm, price_per_person: parseInt(e.target.value)})}
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>
            </div>
          )}

          {editModal.type === 'team' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số người cần
                </label>
                <input
                  type="number"
                  value={editForm.players_needed || 1}
                  onChange={(e) => setEditForm({...editForm, players_needed: parseInt(e.target.value)})}
                  min={1}
                  max={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vị trí cần
                </label>
                <select
                  value={editForm.position_needed || 'any'}
                  onChange={(e) => setEditForm({...editForm, position_needed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="goalkeeper">Thủ môn</option>
                  <option value="defender">Hậu vệ</option>
                  <option value="midfielder">Tiền vệ</option>
                  <option value="forward">Tiền đạo</option>
                  <option value="any">Bất kỳ</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trình độ
            </label>
            <select
              value={editForm.level || 'intermediate'}
              onChange={(e) => setEditForm({...editForm, level: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="beginner">Mới chơi</option>
              <option value="intermediate">Trung bình</option>
              <option value="advanced">Khá</option>
              <option value="pro">Giỏi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú
            </label>
            <textarea
              value={editForm.description || ''}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none"
              placeholder="Mô tả thêm về trận đấu..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên liên hệ
              </label>
              <input
                type="text"
                value={editForm.contact_name || ''}
                onChange={(e) => setEditForm({...editForm, contact_name: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={editForm.contact_phone || ''}
                onChange={(e) => setEditForm({...editForm, contact_phone: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditModal(null)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
            >
              Hủy
            </button>
            
            <button
              type="submit"
              disabled={actionLoading[`edit-${editModal.type}-${editModal.item.id}`]}
              className={`bg-gradient-to-r ${editModal.type === 'match' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'} text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm`}
            >
              {actionLoading[`edit-${editModal.type}-${editModal.item.id}`] ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save text-xs"></i>
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserPostsManagement;