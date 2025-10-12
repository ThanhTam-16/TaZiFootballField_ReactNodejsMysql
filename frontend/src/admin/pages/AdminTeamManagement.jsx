// ====== frontend/src/admin/pages/AdminTeamManagement.jsx (TAILWIND VERSION) ======
import { useState, useEffect } from 'react';
import { matchService, teamJoinService } from '../services';
import TeamStats from '../components/team/TeamStats';
import TeamFilters from '../components/team/TeamFilters';
import MatchTable from '../components/team/MatchTable';
import TeamJoinTable from '../components/team/TeamJoinTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { useToast } from '../hooks/useToast';

const AdminTeamManagement = () => {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState({ data: [], pagination: {} });
  const [teamJoins, setTeamJoins] = useState({ data: [], pagination: {} });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  
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

  const currentData = activeTab === 'matches' ? matches : teamJoins;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý Kèo & Ghép đội
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Quản lý tất cả hoạt động tìm kèo và ghép đội
            </p>
          </div>
          
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>

        {/* Stats */}
        <TeamStats stats={stats} activeTab={activeTab} />

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button 
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'matches'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleTabChange('matches')}
            >
              <i className="fas fa-futbol"></i>
              <span>Tìm Kèo</span>
              {activeTab === 'matches' && stats.total > 0 && (
                <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {stats.total}
                </span>
              )}
            </button>
            
            <button 
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'team-joins'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleTabChange('team-joins')}
            >
              <i className="fas fa-users"></i>
              <span>Ghép Đội</span>
              {activeTab === 'team-joins' && stats.total > 0 && (
                <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
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

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingSpinner message="Đang tải dữ liệu..." />
            </div>
          ) : activeTab === 'matches' ? (
            <MatchTable 
              matches={matches.data} 
              onRefresh={loadData}
              loading={loading}
            />
          ) : (
            <TeamJoinTable 
              teamJoins={teamJoins.data} 
              onRefresh={loadData}
              loading={loading}
            />
          )}
          
          {/* Pagination */}
          {currentData.pagination && currentData.pagination.totalPages > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
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
      </div>
    </div>
  );
};

export default AdminTeamManagement;