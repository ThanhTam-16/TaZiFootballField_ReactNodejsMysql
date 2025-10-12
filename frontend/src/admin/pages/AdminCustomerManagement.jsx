// ====== frontend/src/admin/pages/AdminCustomerManagement.jsx (TAILWIND VERSION) ======
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
  const [stats, setStats] = useState({
    total_customers: 0,
    active_customers: 0,
    inactive_customers: 0,
    new_customers_30d: 0,
    vip_customers: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(20);
  
  // Filters
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

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadData();
  }, [currentPage, filters]);

  // Load customers and stats
  const loadData = async () => {
    try {
      setLoading(true);
      
      const filterParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        sort: filters.sortBy,
        order: filters.sortOrder
      };

      const [customersData, statsData] = await Promise.all([
        customerService.getCustomers(filterParams),
        customerService.getCustomerStats()
      ]);

      setCustomers(customersData.customers);
      setTotalPages(customersData.pagination.totalPages);
      setTotalItems(customersData.pagination.total);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Lỗi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (field) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    handleFilterChange({ sortBy: field, sortOrder: newOrder });
  };

  // Handle customer selection
  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  // Handle select all
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

  // Customer CRUD operations
  const handleSaveCustomer = async (customerData) => {
    try {
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomerDetail = async (customerId) => {
    try {
      const customerDetail = await customerService.getCustomerById(customerId);
      openModal('detail', customerDetail);
    } catch (error) {
      showToast('Lỗi tải thông tin khách hàng', 'error');
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
          showToast('Lỗi xóa khách hàng', 'error');
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
          showToast(`Lỗi ${actionText[action]} khách hàng`, 'error');
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

  // Confirm modal helper
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

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý khách hàng
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Quản lý thông tin và hoạt động của khách hàng
            </p>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Customer Table */}
        <CustomerTable
          customers={customers}
          selectedCustomers={selectedCustomers}
          filters={filters}
          onSelectCustomer={handleSelectCustomer}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
          onViewDetail={handleViewCustomerDetail}
          onEditCustomer={(customer) => openModal('customer', customer)}
          onDeleteCustomer={handleDeleteCustomer}
          loading={loading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Customer Modal */}
        {modals.customer && (
          <CustomerModal
            customer={editingCustomer}
            onSave={handleSaveCustomer}
            onClose={() => closeModal('customer')}
            loading={loading}
          />
        )}

        {/* Customer Detail Modal */}
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

        {/* Confirm Modal */}
        {modals.confirm && (
          <ConfirmModal
            message={confirmMessage}
            onConfirm={handleConfirm}
            onCancel={() => closeModal('confirm')}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCustomerManagement;