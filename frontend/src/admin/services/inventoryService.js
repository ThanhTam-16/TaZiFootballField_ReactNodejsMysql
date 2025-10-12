// frontend/src/admin/services/inventoryService.js
import BaseService from './baseService';

class InventoryService extends BaseService {
  constructor() {
    super('/admin/inventory');
  }

  async getProducts(params = {}) {
    return this.get('/products', params);
  }

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.post('/products', productData);
  }

  async updateProduct(id, productData) {
    return this.put(`/products/${id}`, productData);
  }

  async deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }

  async getStats() {
    return this.get('/stats');
  }

  async createTransaction(transactionData) {
    return this.post('/transactions', transactionData);
  }

  async getTransactionHistory(params = {}) {
    return this.get('/transactions', params);
  }

  async quickStockUpdate(productId, quantity, type) {
    return this.post('/quick-update', {
      product_id: productId,
      quantity,
      type
    });
  }
}

export default new InventoryService();

// Named exports
export const getProducts = (params) => new InventoryService().getProducts(params);
export const getProduct = (id) => new InventoryService().getProduct(id);
export const createProduct = (data) => new InventoryService().createProduct(data);
export const updateProduct = (id, data) => new InventoryService().updateProduct(id, data);
export const deleteProduct = (id) => new InventoryService().deleteProduct(id);
export const getInventoryStats = () => new InventoryService().getStats();
export const createTransaction = (data) => new InventoryService().createTransaction(data);
export const getTransactionHistory = (params) => new InventoryService().getTransactionHistory(params);
export const quickStockUpdate = (id, quantity, type) => new InventoryService().quickStockUpdate(id, quantity, type);