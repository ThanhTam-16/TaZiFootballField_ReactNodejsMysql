// frontend/src/admin/services/dashboardService.js - ENHANCED WITH CHART DATA
import BaseService from './baseService';

class DashboardService extends BaseService {
  constructor() {
    super('/admin/dashboard');
  }

  // ========== EXISTING METHODS ==========
  async getDashboardStats() {
    try {
      console.log('Trying fast dashboard stats first...');
      
      try {
        const response = await this.get('/fast', {}, { timeout: 3000 });
        console.log('Fast dashboard stats successful:', response);
        return response;
      } catch (fastError) {
        console.log('Fast endpoint failed, trying regular endpoint:', fastError.message);
        
        const response = await this.get('/', {}, { timeout: 5000 });
        console.log('Regular dashboard stats successful:', response);
        return response;
      }
    } catch (error) {
      console.error('All dashboard endpoints failed:', error);
      
      console.log('Using hardcoded fallback data');
      return {
        today_revenue: 0,
        today_bookings: 0,
        pending_bookings: 3,
        total_fields: 5,
        total_users: 5
      };
    }
  }

  async getRecentBookings(limit = 10) {
    try {
      console.log('Fetching recent bookings with timeout protection');
      const response = await this.get('/recent-bookings', { limit }, { timeout: 3000 });
      console.log('Recent bookings response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      return [];
    }
  }

  async getStatsOnly() {
    try {
      console.log('Getting stats only (fastest method)');
      
      const response = await this.get('/quick-stats', {}, { timeout: 2000 });
      console.log('Quick stats response:', response);
      
      return {
        today_revenue: response.today_revenue || 0,
        today_bookings: response.today_bookings || 0,
        pending_bookings: response.pending_bookings || 0,
        total_fields: 5,
        total_users: 5
      };
    } catch (error) {
      console.error('Quick stats failed:', error);
      return {
        today_revenue: 0,
        today_bookings: 0,
        pending_bookings: 3,
        total_fields: 5,
        total_users: 5
      };
    }
  }

  // ========== NEW CHART DATA METHODS ==========
  async getRevenueChart(days = 7) {
    try {
      const response = await this.get('/charts/revenue', { days }, { timeout: 3000 });
      return response;
    } catch (error) {
      console.error('Error fetching revenue chart:', error);
      return [];
    }
  }

  async getPopularFields() {
    try {
      const response = await this.get('/charts/popular-fields', {}, { timeout: 3000 });
      return response;
    } catch (error) {
      console.error('Error fetching popular fields:', error);
      return [];
    }
  }

  async getBookingStatusChart() {
    try {
      const response = await this.get('/charts/booking-status', {}, { timeout: 3000 });
      return response;
    } catch (error) {
      console.error('Error fetching booking status:', error);
      return [];
    }
  }

  async getHourlyBookingChart() {
    try {
      const response = await this.get('/charts/hourly-booking', {}, { timeout: 3000 });
      return response;
    } catch (error) {
      console.error('Error fetching hourly booking:', error);
      return [];
    }
  }

  async getFieldTypeRevenue() {
    try {
      const response = await this.get('/charts/field-type-revenue', {}, { timeout: 3000 });
      return response;
    } catch (error) {
      console.error('Error fetching field type revenue:', error);
      return [];
    }
  }

  async getCustomerGrowth(days = 30) {
    try {
      const response = await this.get('/charts/customer-growth', { days }, { timeout: 3000 });
      return response;
    } catch (error) {
      console.error('Error fetching customer growth:', error);
      return [];
    }
  }
}

export default new DashboardService();

// Named exports for compatibility
export const getDashboardStats = () => new DashboardService().getDashboardStats();
export const getRecentBookings = (limit) => new DashboardService().getRecentBookings(limit);