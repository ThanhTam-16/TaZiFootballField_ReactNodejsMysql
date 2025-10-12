// admin/services/maintenanceService.js - Fixed Admin Service
import API from '../../services/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const maintenanceService = {
  // Admin methods
  getAllMaintenances: async (params = {}) => {
    try {
      const response = await API.get('/maintenance/admin', { 
        params,
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy danh sách bảo trì' };
    }
  },

  getMaintenanceStats: async () => {
    try {
      const response = await API.get('/maintenance/admin/stats', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thống kê bảo trì' };
    }
  },

  getMaintenanceById: async (id) => {
    try {
      const response = await API.get(`/maintenance/admin/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy chi tiết bảo trì' };
    }
  },

  createMaintenance: async (data) => {
    try {
      const response = await API.post('/maintenance/admin', data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi tạo lịch bảo trì' };
    }
  },

  updateMaintenance: async (id, data) => {
    try {
      const response = await API.put(`/maintenance/admin/${id}`, data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi cập nhật lịch bảo trì' };
    }
  },

  deleteMaintenance: async (id) => {
    try {
      const response = await API.delete(`/maintenance/admin/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi xóa lịch bảo trì' };
    }
  },

  createHolidayMaintenance: async (data) => {
    try {
      const response = await API.post('/maintenance/admin', {
        ...data,
        type: 'holiday',
        field_id: 'all-fields'
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi tạo lịch nghỉ lễ' };
    }
  },

  // Customer methods (for reference)
  getMaintenanceSchedule: async (params = {}) => {
    try {
      const response = await API.get('/maintenance/schedule', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy lịch bảo trì' };
    }
  },

  getActiveMaintenances: async () => {
    try {
      const response = await API.get('/maintenance/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy bảo trì đang hoạt động' };
    }
  }
};

export default maintenanceService;

// Named exports cho compatibility
export const {
  getAllMaintenances,
  getMaintenanceStats,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  createHolidayMaintenance,
  getMaintenanceSchedule,
  getActiveMaintenances
} = maintenanceService;