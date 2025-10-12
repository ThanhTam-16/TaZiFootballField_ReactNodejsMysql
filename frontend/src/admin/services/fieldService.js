// admin/services/fieldService.js - Fixed Admin Service
import BaseService from './baseService';

class FieldService extends BaseService {
  constructor() {
    super(''); // No base prefix
  }

  async getAllFields() {
    return this.get('/fields/admin');
  }

  async getFieldsWithBookings(date) {
    return this.get('/fields/admin/with-bookings', { date });
  }

  async getFieldStats() {
    return this.get('/fields/admin/stats');
  }

  async createField(fieldData) {
    return this.post('/fields/admin', fieldData);
  }

  async updateField(fieldId, fieldData) {
    return this.put(`/fields/admin/${fieldId}`, fieldData);
  }

  async deleteField(fieldId) {
    return this.delete(`/fields/admin/${fieldId}`);
  }

  // Customer field methods (for reference)
  async getAvailableFields(params) {
    return this.get('/fields/available', params);
  }

  async getAllPublicFields() {
    return this.get('/fields');
  }
}

export default new FieldService();

// Named exports for compatibility
export const getAllFields = () => new FieldService().getAllFields();
export const getFieldsWithBookings = (date) => new FieldService().getFieldsWithBookings(date);
export const createField = (data) => new FieldService().createField(data);
export const updateField = (id, data) => new FieldService().updateField(id, data);