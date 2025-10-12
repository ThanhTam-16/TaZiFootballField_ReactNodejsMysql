// ====== frontend/src/admin/pages/AdminMaintenanceManagement.jsx (TAILWIND VERSION) ======
import { useState, useEffect } from 'react';
import { maintenanceService, fieldService } from '../services';
import MaintenanceStats from '../components/maintenance/MaintenanceStats';
import MaintenanceFilters from '../components/maintenance/MaintenanceFilters';
import MaintenanceTable from '../components/maintenance/MaintenanceTable';
import MaintenanceModal from '../components/maintenance/MaintenanceModal';
import MaintenanceDetailModal from '../components/maintenance/MaintenanceDetailModal';
import ConfirmModal from '../components/common/ConfirmModal';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const AdminMaintenanceManagement = () => {
  // State management
  const [maintenances, setMaintenances] = useState([]);
  const [fields, setFields] = useState([]);
  const [stats, setStats] = useState({
    total_maintenance: 0,
    active_maintenance: 0,
    upcoming_maintenance: 0,
    overdue_maintenance: 0,
    completed_maintenance: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedMaintenances, setSelectedMaintenances] = useState([]);
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(20);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    field_id: 'all',
    status: 'all',
    type: 'all',
    date_from: '',
    date_to: '',
    sortBy: 'scheduled_date',
    sortOrder: 'DESC'
  });
  
  // Modals
  const [modals, setModals] = useState({
    maintenance: false,
    detail: false,
    confirm: false
  });
  
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [selectedMaintenanceDetail, setSelectedMaintenanceDetail] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const { showToast } = useToast();

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadData();
  }, [currentPage, filters]);

  useEffect(() => {
    loadFields();
  }, []);

  // Load maintenances and stats
  const loadData = async () => {
    try {
      setLoading(true);
      
      const filterParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search || undefined,
        field_id: filters.field_id !== 'all' ? filters.field_id : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        type: filters.type !== 'all' ? filters.type : undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        sort: filters.sortBy,
        order: filters.sortOrder
      };

      const [maintenancesData, statsData] = await Promise.all([
        maintenanceService.getAllMaintenances(filterParams),
        maintenanceService.getMaintenanceStats()
      ]);

      setMaintenances(maintenancesData.maintenances || []);
      setTotalPages(maintenancesData.pagination?.totalPages || 1);
      setTotalItems(maintenancesData.pagination?.total || 0);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Lỗi tải dữ liệu bảo trì', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load fields for filter dropdown
  const loadFields = async () => {
    try {
      const fieldsData = await fieldService.getAllFields();
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading fields:', error);
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

  // Handle maintenance selection
  const handleSelectMaintenance = (maintenanceId, checked) => {
    if (checked) {
      setSelectedMaintenances(prev => [...prev, maintenanceId]);
    } else {
      setSelectedMaintenances(prev => prev.filter(id => id !== maintenanceId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectedMaintenances(checked ? maintenances.map(m => m.id) : []);
  };

  // Modal handlers
  const openModal = (modalType, data = null) => {
    if (modalType === 'maintenance') {
      setEditingMaintenance(data);
    } else if (modalType === 'detail') {
      setSelectedMaintenanceDetail(data);
    }
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'maintenance') {
      setEditingMaintenance(null);
    } else if (modalType === 'detail') {
      setSelectedMaintenanceDetail(null);
    }
  };

  // Maintenance CRUD operations
  const handleSaveMaintenance = async (maintenanceData) => {
    try {
      setLoading(true);
      
      if (editingMaintenance) {
        await maintenanceService.updateMaintenance(editingMaintenance.id, maintenanceData);
        showToast('Cập nhật lịch bảo trì thành công', 'success');
      } else {
        await maintenanceService.createMaintenance(maintenanceData);
        showToast('Tạo lịch bảo trì thành công', 'success');
      }
      
      closeModal('maintenance');
      await loadData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMaintenanceDetail = async (maintenanceId) => {
    try {
      const maintenanceDetail = await maintenanceService.getMaintenanceById(maintenanceId);
      openModal('detail', maintenanceDetail);
    } catch (error) {
      showToast('Lỗi tải thông tin bảo trì', 'error');
    }
  };

  const handleDeleteMaintenance = (maintenanceId) => {
    const maintenance = maintenances.find(m => m.id === maintenanceId);
    showConfirm(
      `Bạn có chắc chắn muốn xóa lịch bảo trì ${maintenance?.title || 'này'}?`,
      async () => {
        try {
          await maintenanceService.deleteMaintenance(maintenanceId);
          showToast('Xóa lịch bảo trì thành công', 'success');
          await loadData();
        } catch (error) {
          showToast('Lỗi xóa lịch bảo trì', 'error');
        }
      }
    );
  };

  const handleMaintenanceAction = async (action, maintenanceId) => {
    try {
      setLoading(true);
      
      const actionData = { status: action };
      await maintenanceService.updateMaintenance(maintenanceId, actionData);
      
      const messages = {
        'in_progress': 'Đã bắt đầu bảo trì',
        'completed': 'Đã hoàn thành bảo trì',
        'cancelled': 'Đã hủy bảo trì'
      };
      
      showToast(messages[action] || 'Cập nhật thành công', 'success');
      closeModal('detail');
      await loadData();
    } catch (error) {
      showToast('Lỗi cập nhật trạng thái', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick actions
  const handleCreateHolidayMaintenance = () => {
    const holidayData = {
      type: 'holiday',
      field_id: 'all',
      scheduled_date: new Date().toISOString().split('T')[0],
      title: 'Ngày nghỉ lễ',
      description: 'Tất cả sân đóng cửa nghỉ lễ'
    };
    openModal('maintenance', holidayData);
  };

  // Bulk operations
  const handleBulkAction = (action) => {
    if (selectedMaintenances.length === 0) return;
    
    const actionText = {
      complete: 'hoàn thành',
      cancel: 'hủy',
      delete: 'xóa'
    };

    showConfirm(
      `Bạn có chắc chắn muốn ${actionText[action]} ${selectedMaintenances.length} lịch bảo trì?`,
      async () => {
        try {
          // Implement bulk operations based on your API
          for (const id of selectedMaintenances) {
            if (action === 'delete') {
              await maintenanceService.deleteMaintenance(id);
            } else {
              await maintenanceService.updateMaintenance(id, { status: action === 'complete' ? 'completed' : 'cancelled' });
            }
          }
          showToast(`${actionText[action]} thành công ${selectedMaintenances.length} lịch bảo trì`, 'success');
          setSelectedMaintenances([]);
          await loadData();
        } catch (error) {
          showToast(`Lỗi ${actionText[action]} lịch bảo trì`, 'error');
        }
      }
    );
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

  // Utility functions
  const getFieldText = (fieldId) => {
    if (fieldId === 'all') return 'Tất cả sân';
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'Không xác định';
  };

  const getStatusText = (status) => {
    const statuses = {
      'scheduled': 'Đã lên lịch',
      'in_progress': 'Đang thực hiện',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return statuses[status] || 'Không xác định';
  };

  const getTypeText = (type) => {
    const types = {
      'routine': 'Bảo trì định kỳ',
      'repair': 'Sửa chữa',
      'upgrade': 'Nâng cấp',
      'holiday': 'Nghỉ lễ',
      'emergency': 'Khẩn cấp'
    };
    return types[type] || 'Khác';
  };

  if (loading && maintenances.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Đang tải dữ liệu bảo trì..." />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý bảo trì
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Lên lịch và theo dõi bảo trì sân bóng
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCreateHolidayMaintenance}
              className="flex items-center space-x-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              <i className="fas fa-calendar-times text-xs"></i>
              <span className="hidden sm:inline">Tạo ngày lễ</span>
              <span className="sm:hidden">Ngày lễ</span>
            </button>
            
            <button
              onClick={() => openModal('maintenance')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 text-sm"
            >
              <i className="fas fa-plus text-xs"></i>
              <span>Tạo lịch bảo trì</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <MaintenanceStats stats={stats} />

        {/* Filters */}
        <MaintenanceFilters
          filters={filters}
          fields={fields}
          onFilterChange={handleFilterChange}
          getFieldText={getFieldText}
          getStatusText={getStatusText}
          getTypeText={getTypeText}
        />

        {/* Bulk Actions */}
        {selectedMaintenances.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-slide-down">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i className="fas fa-check-square text-blue-600 dark:text-blue-400 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Đã chọn {selectedMaintenances.length} lịch bảo trì
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Chọn thao tác để áp dụng cho tất cả
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleBulkAction('complete')}
                  className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                >
                  <i className="fas fa-check text-xs mr-2"></i>
                  <span>Hoàn thành</span>
                </button>

                <button
                  onClick={() => handleBulkAction('cancel')}
                  className="inline-flex items-center px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                >
                  <i className="fas fa-ban text-xs mr-2"></i>
                  <span>Hủy</span>
                </button>

                <button
                  onClick={() => handleBulkAction('delete')}
                  className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                >
                  <i className="fas fa-trash text-xs mr-2"></i>
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Table */}
        <MaintenanceTable
          maintenances={maintenances}
          selectedMaintenances={selectedMaintenances}
          filters={filters}
          fields={fields}
          onSelectMaintenance={handleSelectMaintenance}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
          onViewDetail={handleViewMaintenanceDetail}
          onEditMaintenance={(maintenance) => openModal('maintenance', maintenance)}
          onDeleteMaintenance={handleDeleteMaintenance}
          onMaintenanceAction={handleMaintenanceAction}
          getFieldText={getFieldText}
          getStatusText={getStatusText}
          getTypeText={getTypeText}
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

        {/* Maintenance Modal */}
        {modals.maintenance && (
          <MaintenanceModal
            maintenance={editingMaintenance}
            fields={fields}
            onSave={handleSaveMaintenance}
            onClose={() => closeModal('maintenance')}
            loading={loading}
            getFieldText={getFieldText}
            getStatusText={getStatusText}
            getTypeText={getTypeText}
          />
        )}

        {/* Maintenance Detail Modal */}
        {modals.detail && selectedMaintenanceDetail && (
          <MaintenanceDetailModal
            maintenance={selectedMaintenanceDetail}
            fields={fields}
            onClose={() => closeModal('detail')}
            onEdit={() => {
              closeModal('detail');
              openModal('maintenance', selectedMaintenanceDetail);
            }}
            onAction={handleMaintenanceAction}
            getFieldText={getFieldText}
            getStatusText={getStatusText}
            getTypeText={getTypeText}
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

export default AdminMaintenanceManagement;