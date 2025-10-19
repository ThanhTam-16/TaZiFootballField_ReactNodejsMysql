// ====== frontend/src/admin/pages/AdminCustomerManagement.jsx (OPTIMIZED) ======
import { useState, useEffect } from 'react';
import { customerService } from '../services';
import CustomerStats from '../components/customer/CustomerStats';
import CustomerFilters from '../components/customer/CustomerFilters';
import CustomerTable from '../components/customer/CustomerTable';
import CustomerModal from '../components/customer/CustomerModal';
import CustomerDetailModal from '../components/customer/CustomerDetailModal';
import ConfirmModal from '../components/common/ConfirmModal';
import BulkActions from '../components/customer/BulkActions';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const AdminCustomerManagement = () => {
  // State management
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  
  // Pagination & Filters
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  
  // Modals
  const [modals, setModals] = useState({
    customer: false,
    detail: false,
    confirm: false
  });
  
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const { showToast } = useToast();

  // Load data on mount and filter changes
  useEffect(() => {
    loadData();
  }, [filters, pagination.page]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        sort: filters.sortBy,
        order: filters.sortOrder
      };

      const [customersData, statsData] = await Promise.all([
        customerService.getCustomers(params),
        customerService.getCustomerStats()
      ]);

      setCustomers(customersData.customers || []);
      setPagination(prev => ({
        ...prev,
        total: customersData.pagination?.total || 0,
        totalPages: customersData.pagination?.totalPages || 0
      }));
      setStats(statsData || {});
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Không thể tải danh sách khách hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSelectedCustomers([]);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Selection handlers
  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedCustomers(checked ? customers.map(c => c.id) : []);
  };

  // Modal handlers
  const openModal = (modalType, data = null) => {
    if (modalType === 'customer') {
      setEditingCustomer(data);
    } else if (modalType === 'detail') {
      setSelectedCustomerDetail(data);
    }
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'customer') {
      setEditingCustomer(null);
    } else if (modalType === 'detail') {
      setSelectedCustomerDetail(null);
    }
  };

  // CRUD operations
  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, customerData);
        showToast('Cập nhật khách hàng thành công', 'success');
      } else {
        await customerService.createCustomer(customerData);
        showToast('Tạo khách hàng thành công', 'success');
      }
      closeModal('customer');
      await loadData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra';
      showToast(errorMessage, 'error');
    }
  };

  const handleViewCustomerDetail = async (customerId) => {
    try {
      const customerDetail = await customerService.getCustomerById(customerId);
      openModal('detail', customerDetail);
    } catch (error) {
      showToast('Không thể tải thông tin khách hàng', 'error');
    }
  };

  const handleDeleteCustomer = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    showConfirm(
      `Bạn có chắc chắn muốn xóa khách hàng ${customer?.name}?`,
      async () => {
        try {
          await customerService.deleteCustomer(customerId);
          showToast('Xóa khách hàng thành công', 'success');
          await loadData();
        } catch (error) {
          showToast('Không thể xóa khách hàng', 'error');
        }
      }
    );
  };

  // Bulk operations
  const handleBulkAction = (action) => {
    if (selectedCustomers.length === 0) return;
    
    const actionText = {
      activate: 'kích hoạt',
      deactivate: 'vô hiệu hóa',
      delete: 'xóa'
    };

    showConfirm(
      `Bạn có chắc chắn muốn ${actionText[action]} ${selectedCustomers.length} khách hàng?`,
      async () => {
        try {
          await customerService.bulkUpdateCustomers(selectedCustomers, action);
          showToast(`${actionText[action]} thành công ${selectedCustomers.length} khách hàng`, 'success');
          setSelectedCustomers([]);
          await loadData();
        } catch (error) {
          showToast(`Không thể ${actionText[action]} khách hàng`, 'error');
        }
      }
    );
  };

  const handleExportCustomers = () => {
    if (selectedCustomers.length === 0) return;
    
    const selectedData = customers.filter(c => selectedCustomers.includes(c.id));
    customerService.exportCustomersToCSV(selectedData);
    showToast(`Xuất Excel thành công ${selectedCustomers.length} khách hàng`, 'success');
  };

  // Confirm helper
  const showConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    openModal('confirm');
  };

  const handleConfirm = () => {
    closeModal('confirm');
    if (confirmAction) confirmAction();
    setConfirmAction(null);
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            Quản lý khách hàng
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thông tin và hoạt động của khách hàng
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => openModal('customer')}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 text-xs"
          >
            <i className="fas fa-plus text-xs"></i>
            <span>Thêm khách hàng</span>
          </button>
          
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 text-xs disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt text-xs ${loading ? 'animate-spin' : ''}`}></i>
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <CustomerStats stats={stats} />

      {/* Filters */}
      <CustomerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onAddCustomer={() => openModal('customer')}
      />

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <BulkActions
          selectedCount={selectedCustomers.length}
          onBulkAction={handleBulkAction}
          onExport={handleExportCustomers}
        />
      )}

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <LoadingSpinner message="Đang tải danh sách khách hàng..." />
          </div>
        ) : (
          <>
            <CustomerTable
              customers={customers}
              selectedCustomers={selectedCustomers}
              filters={filters}
              onSelectCustomer={handleSelectCustomer}
              onSelectAll={handleSelectAll}
              onViewDetail={handleViewCustomerDetail}
              onEditCustomer={(customer) => openModal('customer', customer)}
              onDeleteCustomer={handleDeleteCustomer}
            />
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {modals.customer && (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => closeModal('customer')}
        />
      )}

      {modals.detail && selectedCustomerDetail && (
        <CustomerDetailModal
          customer={selectedCustomerDetail}
          onClose={() => closeModal('detail')}
          onEdit={() => {
            closeModal('detail');
            openModal('customer', selectedCustomerDetail);
          }}
        />
      )}

      {modals.confirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={handleConfirm}
          onCancel={() => closeModal('confirm')}
        />
      )}
    </div>
  );
};

export default AdminCustomerManagement;