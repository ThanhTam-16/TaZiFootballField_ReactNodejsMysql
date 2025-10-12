// frontend/src/admin/services/customerService.js - FIXED VERSION
import BaseService from './baseService';

class CustomerService extends BaseService {
  constructor() {
    super('/admin');
  }

  // Get all customers with pagination and filters
  async getCustomers(params = {}) {
    try {
      const response = await this.get('/customers', params);
      console.log('Customer service response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Error getting customers:', error);
      throw error;
    }
  }

  // Get customer by ID
  async getCustomerById(customerId) {
    try {
      const response = await this.get(`/customers/${customerId}`);
      return response;
    } catch (error) {
      console.error('Error getting customer by ID:', error);
      throw error;
    }
  }

  // Create new customer
  async createCustomer(customerData) {
    try {
      const response = await this.post('/customers', customerData);
      return response;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Update customer
  async updateCustomer(customerId, customerData) {
    try {
      const response = await this.put(`/customers/${customerId}`, customerData);
      return response;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // Delete customer
  async deleteCustomer(customerId) {
    try {
      const response = await this.delete(`/customers/${customerId}`);
      return response;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  // Bulk update customers
  async bulkUpdateCustomers(customerIds, action) {
    try {
      const response = await this.patch('/customers/bulk', {
        customerIds,
        action
      });
      return response;
    } catch (error) {
      console.error('Error bulk updating customers:', error);
      throw error;
    }
  }

  // Get customer statistics
  async getCustomerStats() {
    try {
      const response = await this.get('/customers/stats');
      return response;
    } catch (error) {
      console.error('Error getting customer stats:', error);
      // Return default stats if error
      return {
        total_customers: 0,
        active_customers: 0,
        inactive_customers: 0,
        new_customers_30d: 0,
        vip_customers: 0
      };
    }
  }

  // Utility methods
  formatCurrency(amount) {
    if (!amount || amount === 0) return '0₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString) {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  calculateSuccessRate(customer) {
    if (!customer || !customer.total_bookings || customer.total_bookings === 0) {
      return 0;
    }
    
    const completedBookings = customer.completed_bookings || 0;
    return Math.round((completedBookings / customer.total_bookings) * 100);
  }

  // Export customers to CSV
  exportCustomersToCSV(customers) {
    try {
      const headers = [
        'ID',
        'Tên khách hàng',
        'Số điện thoại',
        'Email',
        'Tổng đặt sân',
        'Thành công',
        'Đã hủy',
        'Tổng chi tiêu',
        'Trạng thái',
        'Ngày tạo'
      ];

      const csvContent = [
        headers.join(','),
        ...customers.map(customer => [
          customer.id,
          `"${customer.name}"`,
          customer.phone_number,
          customer.email || '',
          customer.total_bookings || 0,
          customer.completed_bookings || 0,
          customer.cancelled_bookings || 0,
          customer.total_spent || 0,
          customer.is_active ? 'Hoạt động' : 'Không hoạt động',
          this.formatDate(customer.created_at)
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `khach-hang-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw new Error('Lỗi xuất file Excel');
    }
  }

  // Get customer type (VIP, Regular)
  getCustomerType(customer) {
    const totalBookings = customer.total_bookings || 0;
    if (totalBookings >= 10) {
      return {
        type: 'VIP',
        icon: 'fas fa-star',
        class: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300'
      };
    }
    return {
      type: 'Thường',
      icon: 'fas fa-user',
      class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
  }

  // Calculate customer loyalty score
  getCustomerLoyaltyScore(customer) {
    const bookings = customer.total_bookings || 0;
    const successRate = this.calculateSuccessRate(customer);
    const totalSpent = customer.total_spent || 0;
    
    let score = 0;
    
    // Booking frequency (max 40 points)
    score += Math.min(bookings * 2, 40);
    
    // Success rate (max 30 points)
    score += (successRate * 30) / 100;
    
    // Spending amount (max 30 points)
    if (totalSpent >= 5000000) score += 30; // 5M+
    else if (totalSpent >= 2000000) score += 20; // 2M+
    else if (totalSpent >= 1000000) score += 10; // 1M+
    else if (totalSpent >= 500000) score += 5; // 500K+
    
    return Math.min(Math.round(score), 100);
  }

  // Get customer insights
  getCustomerInsights(customer) {
    const loyaltyScore = this.getCustomerLoyaltyScore(customer);
    const successRate = this.calculateSuccessRate(customer);
    const totalBookings = customer.total_bookings || 0;
    const totalSpent = customer.total_spent || 0;
    
    const insights = [];
    
    if (loyaltyScore >= 80) {
      insights.push({
        type: 'positive',
        message: 'Khách hàng có độ trung thành cao',
        icon: 'fas fa-heart'
      });
    }
    
    if (successRate >= 90) {
      insights.push({
        type: 'positive',
        message: 'Tỷ lệ đặt sân thành công rất cao',
        icon: 'fas fa-trophy'
      });
    }
    
    if (totalBookings >= 15) {
      insights.push({
        type: 'info',
        message: 'Khách hàng thường xuyên',
        icon: 'fas fa-calendar-check'
      });
    }
    
    if (totalSpent >= 3000000) {
      insights.push({
        type: 'positive',
        message: 'Khách hàng có giá trị cao',
        icon: 'fas fa-gem'
      });
    }
    
    if (successRate < 50 && totalBookings > 5) {
      insights.push({
        type: 'warning',
        message: 'Tỷ lệ hủy đặt sân cao, cần chú ý',
        icon: 'fas fa-exclamation-triangle'
      });
    }
    
    return insights;
  }

  // Filter customers by criteria
  filterCustomers(customers, criteria) {
    return customers.filter(customer => {
      // VIP filter
      if (criteria.vip !== undefined) {
        const isVip = (customer.total_bookings || 0) >= 10;
        if (criteria.vip !== isVip) return false;
      }
      
      // Active filter
      if (criteria.active !== undefined) {
        if (criteria.active !== customer.is_active) return false;
      }
      
      // Booking count filter
      if (criteria.minBookings !== undefined) {
        if ((customer.total_bookings || 0) < criteria.minBookings) return false;
      }
      
      // Spending filter
      if (criteria.minSpending !== undefined) {
        if ((customer.total_spent || 0) < criteria.minSpending) return false;
      }
      
      return true;
    });
  }
}

// Create and export instance
const customerService = new CustomerService();
export { customerService };
export default customerService;