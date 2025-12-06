// admin/services/matchService.js 
import API from '../../services/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const MatchService = {
  // Admin methods
  getMatches: async (params = {}) => {
    try {
      const response = await API.get('/matches/admin', { 
        params,
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy danh sách matches' };
    }
  },

  getMatchById: async (id) => {
    try {
      const response = await API.get(`/matches/admin/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thông tin match' };
    }
  },

  createMatch: async (matchData) => {
    try {
      const response = await API.post('/matches/admin', matchData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi tạo match' };
    }
  },

  updateMatch: async (id, matchData) => {
    try {
      const response = await API.put(`/matches/admin/${id}`, matchData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi cập nhật match' };
    }
  },

  deleteMatch: async (id) => {
    try {
      const response = await API.delete(`/matches/admin/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi xóa match' };
    }
  },

  bulkUpdateStatus: async (matchIds, status) => {
    try {
      const response = await API.post('/matches/admin/bulk-update', {
        matchIds,
        status
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi cập nhật hàng loạt' };
    }
  },

  getStats: async () => {
    try {
      const response = await API.get('/matches/admin/stats', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thống kê' };
    }
  }
};

export default MatchService;