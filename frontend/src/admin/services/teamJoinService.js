// admin/services/teamJoinService.js - Fixed Admin Service
import API from '../../services/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const TeamJoinService = {
  // Admin methods
  getPosts: async (params = {}) => {
    try {
      const response = await API.get('/team-joins/admin', { 
        params,
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy danh sách posts' };
    }
  },

  getPostById: async (id) => {
    try {
      const response = await API.get(`/team-joins/admin/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thông tin post' };
    }
  },

  createPost: async (postData) => {
    try {
      const response = await API.post('/team-joins/admin', postData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi tạo post' };
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await API.put(`/team-joins/admin/${id}`, postData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi cập nhật post' };
    }
  },

  deletePost: async (id) => {
    try {
      const response = await API.delete(`/team-joins/admin/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi xóa post' };
    }
  },

  bulkUpdateStatus: async (postIds, status) => {
    try {
      const response = await API.post('/team-joins/admin/bulk-update', {
        postIds,
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
      const response = await API.get('/team-joins/admin/stats', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thống kê' };
    }
  }
};

export default TeamJoinService;