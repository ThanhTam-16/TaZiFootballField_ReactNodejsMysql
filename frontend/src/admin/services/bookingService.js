// admin/services/bookingService.js - Fixed Admin Service
import BaseService from './baseService';

class BookingService extends BaseService {
  constructor() {
    super(''); // No base prefix since we handle it manually
  }

  async getAllBookings(params = {}) {
    return this.get('/bookings/admin', params);
  }

  async getRecentBookings(limit = 10) {
    return this.get('/bookings/admin/recent', { limit });
  }

  async updateBookingStatus(bookingId, status, notes = '') {
    return this.put(`/bookings/admin/${bookingId}/status`, { status, notes });
  }

  async updateBooking(bookingId, bookingData) {
    return this.put(`/bookings/admin/${bookingId}`, bookingData);
  }

  async deleteBooking(bookingId) {
    return this.delete(`/bookings/admin/${bookingId}`);
  }

  async createManualBooking(bookingData) {
    return this.post('/bookings/admin/manual', bookingData);
  }

  // Get fields for booking creation
  async getFields() {
    try {
      const response = await this.get('/fields/admin');
      return response;
    } catch (error) {
      console.error('Error getting fields:', error);
      return [];
    }
  }
}

export default new BookingService();