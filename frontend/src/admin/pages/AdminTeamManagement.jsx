// ====== frontend/src/admin/pages/AdminTeamManagement.jsx (UPDATED) ======
import { useState, useEffect } from 'react';
import { matchService, teamJoinService } from '../services';
import TeamStats from '../components/team/TeamStats';
import TeamFilters from '../components/team/TeamFilters';
import MatchTable from '../components/team/MatchTable';
import TeamJoinTable from '../components/team/TeamJoinTable';
import TeamModal from '../components/team/TeamModal';
import MatchModal from '../components/team/MatchModal';
import TeamBulkActions from '../components/team/TeamBulkActions';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { useToast } from '../hooks/useToast';

const AdminTeamManagement = () => {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState({ data: [], pagination: {} });
  const [teamJoins, setTeamJoins] = useState({ data: [], pagination: {} });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  
  // Selection
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  
  // Modals
  const [modals, setModals] = useState({
    team: false,
    confirm: false
  });
  
  const [editingItem, setEditingItem] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    field_type: '',
    date_from: '',
    date_to: ''
  });

  const { showToast } = useToast();

  // Load data based on active tab
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'matches') {
        const [matchData, matchStats] = await Promise.all([
          matchService.getMatches(filters),
          matchService.getStats()
        ]);
        setMatches(matchData);
        setStats(matchStats);
      } else {
        const [postData, postStats] = await Promise.all([
          teamJoinService.getPosts(filters),
          teamJoinService.getStats()
        ]);
        setTeamJoins(postData);
        setStats(postStats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Lỗi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Clear selection when tab changes
    setSelectedMatches([]);
    setSelectedPosts([]);
  }, [activeTab, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      status: '',
      field_type: '',
      date_from: '',
      date_to: ''
    });
  };

  // Selection handlers
  const handleSelectMatch = (matchId, checked) => {
    if (checked) {
      setSelectedMatches(prev => [...prev, matchId]);
    } else {
      setSelectedMatches(prev => prev.filter(id => id !== matchId));
    }
  };

  const handleSelectAllMatches = (checked) => {
    setSelectedMatches(checked ? matches.data.map(m => m.id) : []);
  };

  const handleSelectPost = (postId, checked) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  const handleSelectAllPosts = (checked) => {
    setSelectedPosts(checked ? teamJoins.data.map(p => p.id) : []);
  };

  // Modal handlers
  const openModal = (modalType, data = null) => {
    if (modalType === 'team') {
      setEditingItem(data);
    }
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'team') {
      setEditingItem(null);
    }
  };

  // CRUD operations
  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        if (activeTab === 'matches') {
          await matchService.updateMatch(editingItem.id, itemData);
        } else {
          await teamJoinService.updatePost(editingItem.id, itemData);
        }
        showToast('Cập nhật thành công', 'success');
      } else {
        if (activeTab === 'matches') {
          await matchService.createMatch(itemData);
        } else {
          await teamJoinService.createPost(itemData);
        }
        showToast('Tạo thành công', 'success');
      }
      closeModal('team');
      await loadData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra';
      showToast(errorMessage, 'error');
    }
  };

  const handleViewDetail = async (itemId) => {
    try {
      let itemDetail;
      if (activeTab === 'matches') {
        itemDetail = await matchService.getMatchById(itemId);
      } else {
        itemDetail = await teamJoinService.getPostById(itemId);
      }
      openModal('team', itemDetail);
    } catch (error) {
      showToast('Không thể tải thông tin chi tiết', 'error');
    }
  };

  const handleDeleteItem = (itemId) => {
    const currentData = activeTab === 'matches' ? matches.data : teamJoins.data;
    const item = currentData.find(item => item.id === itemId);
    const itemType = activeTab === 'matches' ? 'kèo' : 'bài đăng';
    
    showConfirm(
      `Bạn có chắc chắn muốn xóa ${itemType} #${itemId}?`,
      async () => {
        try {
          if (activeTab === 'matches') {
            await matchService.deleteMatch(itemId);
          } else {
            await teamJoinService.deletePost(itemId);
          }
          showToast(`Xóa ${itemType} thành công`, 'success');
          await loadData();
        } catch (error) {
          showToast(`Không thể xóa ${itemType}`, 'error');
        }
      }
    );
  };

  // Bulk operations
  const handleBulkAction = (action) => {
    const selectedItems = activeTab === 'matches' ? selectedMatches : selectedPosts;
    const itemType = activeTab === 'matches' ? 'kèo' : 'bài đăng';
    
    if (selectedItems.length === 0) {
      showToast(`Vui lòng chọn ít nhất một ${itemType}`, 'warning');
      return;
    }

    const actionText = {
      open: 'mở',
      closed: 'đóng',
      delete: 'xóa'
    };

    showConfirm(
      `Bạn có chắc chắn muốn ${actionText[action]} ${selectedItems.length} ${itemType}?`,
      async () => {
        try {
          if (action === 'delete') {
            // Delete items
            const deletePromises = selectedItems.map(id => 
              activeTab === 'matches' 
                ? matchService.deleteMatch(id)
                : teamJoinService.deletePost(id)
            );
            await Promise.all(deletePromises);
          } else {
            // Update status
            if (activeTab === 'matches') {
              await matchService.bulkUpdateStatus(selectedItems, action);
            } else {
              await teamJoinService.bulkUpdateStatus(selectedItems, action);
            }
          }
          
          showToast(`${actionText[action]} thành công ${selectedItems.length} ${itemType}`, 'success');
          
          // Clear selection
          if (activeTab === 'matches') {
            setSelectedMatches([]);
          } else {
            setSelectedPosts([]);
          }
          
          await loadData();
        } catch (error) {
          showToast(`Không thể ${actionText[action]} ${itemType}`, 'error');
        }
      }
    );
  };

  // Confirm helper
  const showConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    openModal('confirm');
  };

  const handleConfirm = () => {
    closeModal('confirm');
    if (confirmAction) confirmAction();
    setConfirmAction(null);
  };

  const currentData = activeTab === 'matches' ? matches : teamJoins;
  const selectedCount = activeTab === 'matches' ? selectedMatches.length : selectedPosts.length;

  return (
    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            Quản lý Kèo & Ghép đội
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tất cả hoạt động tìm kèo và ghép đội
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => openModal('team')}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 text-xs"
          >
            <i className="fas fa-plus text-xs"></i>
            <span>Thêm {activeTab === 'matches' ? 'kèo' : 'bài đăng'}</span>
          </button>
          
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 text-xs disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt text-xs ${loading ? 'animate-spin' : ''}`}></i>
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <TeamStats stats={stats} activeTab={activeTab} />

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
        <div className="grid grid-cols-2 gap-1">
          <button 
            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'matches'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleTabChange('matches')}
          >
            <i className="fas fa-futbol"></i>
            <span>Tìm Kèo</span>
            {activeTab === 'matches' && stats.total > 0 && (
              <span className="bg-white/20 text-white text-xs px-1 py-0.5 rounded-full">
                {stats.total}
              </span>
            )}
          </button>
          
          <button 
            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'team-joins'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleTabChange('team-joins')}
          >
            <i className="fas fa-users"></i>
            <span>Ghép Đội</span>
            {activeTab === 'team-joins' && stats.total > 0 && (
              <span className="bg-white/20 text-white text-xs px-1 py-0.5 rounded-full">
                {stats.total}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <TeamFilters
        filters={filters}
        activeTab={activeTab}
        onFilterChange={handleFilterChange}
      />

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <TeamBulkActions
          selectedCount={selectedCount}
          onBulkAction={handleBulkAction}
          activeTab={activeTab}
        />
      )}

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <LoadingSpinner message="Đang tải dữ liệu..." />
          </div>
        ) : activeTab === 'matches' ? (
          <MatchTable 
            matches={matches.data}
            selectedMatches={selectedMatches}
            onSelectMatch={handleSelectMatch}
            onSelectAll={handleSelectAllMatches}
            onViewDetail={handleViewDetail}
            onEditMatch={(match) => openModal('team', match)}
            onDeleteMatch={handleDeleteItem}
          />
        ) : (
          <TeamJoinTable 
            teamJoins={teamJoins.data}
            selectedPosts={selectedPosts}
            onSelectPost={handleSelectPost}
            onSelectAll={handleSelectAllPosts}
            onViewDetail={handleViewDetail}
            onEditPost={(post) => openModal('team', post)}
            onDeletePost={handleDeleteItem}
          />
        )}
        
        {/* Pagination */}
        {currentData.pagination && currentData.pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <Pagination 
              currentPage={currentData.pagination.page}
              totalPages={currentData.pagination.totalPages}
              totalItems={currentData.pagination.total}
              itemsPerPage={filters.limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {modals.team && activeTab === 'matches' && (
        <MatchModal
          match={editingItem}
          onSave={handleSaveItem}
          onClose={() => closeModal('team')}
        />
      )}

      {modals.team && activeTab === 'team-joins' && (
        <TeamModal
          post={editingItem}
          onSave={handleSaveItem}
          onClose={() => closeModal('team')}
        />
      )}

      {/* Confirm modal (missing -> prevents delete/bulk-actions) */}
      {modals.confirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={handleConfirm}
          onClose={() => closeModal('confirm')}
        />
      )}
    </div>
  );
};

export default AdminTeamManagement;