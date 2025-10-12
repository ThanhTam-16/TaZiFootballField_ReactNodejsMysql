// ====== frontend/src/admin/services/adminService.js ======
import BaseService from './baseService';

class AdminService extends BaseService {
  constructor() {
    super('/admin');
  }

  async getAllAdmins() {
    return this.get('/admins');
  }

  async createAdmin(adminData) {
    return this.post('/admins', adminData);
  }

  // Legacy methods for backward compatibility
  async getAllUsers(params = {}) {
    return this.get('/users', params);
  }
}

export default new AdminService();

// Named exports for compatibility
export const getAllAdmins = () => new AdminService().getAllAdmins();
export const createAdmin = (data) => new AdminService().createAdmin(data);
export const getAllUsers = (params) => new AdminService().getAllUsers(params);