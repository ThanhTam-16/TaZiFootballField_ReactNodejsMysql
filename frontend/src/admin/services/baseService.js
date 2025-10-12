// frontend/src/admin/services/baseService.js - IMPROVED
import API from '../../services/api';

class BaseService {
  constructor(baseURL = '/admin') {
    this.baseURL = baseURL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(method, endpoint, data = null, config = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`Making ${method} request to:`, url);
      
      const requestConfig = {
        method,
        url,
        headers: {
          ...this.getAuthHeaders(),
          ...config.headers
        },
        timeout: 10000, // 10 seconds timeout
        ...config
      };

      if (data) {
        if (method.toLowerCase() === 'get') {
          requestConfig.params = data;
        } else {
          requestConfig.data = data;
        }
      }

      console.log('Request config:', requestConfig);
      const response = await API(requestConfig);
      console.log('Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} ${this.baseURL}${endpoint}:`, error);
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - Server đang quá tải');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized - Vui lòng đăng nhập lại');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found');
      } else if (error.response) {
        throw new Error(error.response.data?.error || 'Server error');
      } else if (error.request) {
        throw new Error('Không thể kết nối đến server');
      } else {
        throw error;
      }
    }
  }

  async get(endpoint, params = {}, config = {}) {
    return this.request('GET', endpoint, params, config);
  }

  async post(endpoint, data = {}, config = {}) {
    return this.request('POST', endpoint, data, config);
  }

  async put(endpoint, data = {}, config = {}) {
    return this.request('PUT', endpoint, data, config);
  }

  async patch(endpoint, data = {}, config = {}) {
    return this.request('PATCH', endpoint, data, config);
  }

  async delete(endpoint, config = {}) {
    return this.request('DELETE', endpoint, null, config);
  }
}

export default BaseService;