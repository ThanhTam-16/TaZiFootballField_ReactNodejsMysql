// ====== frontend/src/admin/services/revenueService.js ======
import BaseService from './baseService';

class RevenueService extends BaseService {
  constructor() {
    super('/admin/revenue');
  }

  async getRevenue(params = {}) {
    return this.get('/', params);
  }

  async getRevenueByPeriod(period = '7') {
    return this.get('/', { period });
  }

  async getRevenueByDateRange(startDate, endDate) {
    return this.get('/', { start_date: startDate, end_date: endDate });
  }
}

export default new RevenueService();

// Named exports for compatibility
export const getRevenue = (params) => new RevenueService().getRevenue(params);
export const getRevenueByPeriod = (period) => new RevenueService().getRevenueByPeriod(period);
export const getRevenueByDateRange = (start, end) => new RevenueService().getRevenueByDateRange(start, end);
