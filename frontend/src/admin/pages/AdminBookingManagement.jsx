// ====== frontend/src/admin/pages/AdminBookingManagement.jsx (TAILWIND VERSION) ======
import { useState, useEffect } from 'react';
import { bookingService } from '../services';
import BookingStats from '../components/booking/BookingStats';
import BookingFilters from '../components/booking/BookingFilters';
import BookingTable from '../components/booking/BookingTable';
import BookingModal from '../components/booking/BookingModal';
import BulkActions from '../components/booking/BulkActions';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { useToast } from '../hooks/useToast';

const AdminBookingManagement = () => {
  // State management
  const [bookings, setBookings] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState([]);
  
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
    field: 'all',
    date: 'all'
  });
  
  // Modals
  const [modals, setModals] = useState({
    booking: false,
    confirm: false
  });
  
  const [editingBooking, setEditingBooking] = useState(null);
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
        field_id: filters.field !== 'all' ? filters.field : undefined,
        date_filter: filters.date !== 'all' ? filters.date : undefined
      };

      const [bookingsData, fieldsData] = await Promise.all([
        bookingService.getAllBookings(params),
        bookingService.getFields()
      ]);

      setBookings(bookingsData.bookings || []);
      setPagination(prev => ({
        ...prev,
        total: bookingsData.pagination?.total || 0,
        totalPages: bookingsData.pagination?.totalPages || 0
      }));
      setFields(fieldsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Không thể tải danh sách đặt sân', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSelectedBookings([]);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Selection handlers
  const handleSelectBooking = (bookingId, checked) => {
    if (checked) {
      setSelectedBookings(prev => [...prev, bookingId]);
    } else {
      setSelectedBookings(prev => prev.filter(id => id !== bookingId));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedBookings(checked ? bookings.map(b => b.id) : []);
  };

  // Modal handlers
  const openModal = (modalType, data = null) => {
    if (modalType === 'booking') {
      setEditingBooking(data);
    }
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'booking') {
      setEditingBooking(null);
    }
  };

  // CRUD operations
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      showToast('Cập nhật trạng thái thành công', 'success');
      await loadData();
    } catch (error) {
      showToast('Không thể cập nhật trạng thái', 'error');
    }
  };

  const handleSaveBooking = async (bookingData) => {
    try {
      if (editingBooking) {
        await bookingService.updateBooking(editingBooking.id, bookingData);
        showToast('Cập nhật đơn đặt sân thành công', 'success');
      } else {
        await bookingService.createManualBooking(bookingData);
        showToast('Tạo đơn đặt sân thành công', 'success');
      }
      closeModal('booking');
      await loadData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = (bookingId) => {
    showConfirm(
      'Bạn có chắc chắn muốn xóa đơn đặt sân này? Hành động này không thể hoàn tác.',
      async () => {
        try {
          await bookingService.deleteBooking(bookingId);
          showToast('Xóa đơn đặt sân thành công', 'success');
          await loadData();
        } catch (error) {
          showToast('Không thể xóa đơn đặt sân', 'error');
        }
      }
    );
  };

  // Bulk operations
  const handleBulkAction = (action) => {
    if (selectedBookings.length === 0) return;
    
    const actionText = {
      approved: 'duyệt',
      cancelled: 'từ chối',
      completed: 'hoàn thành',
      delete: 'xóa'
    };

    showConfirm(
      `Bạn có chắc chắn muốn ${actionText[action]} ${selectedBookings.length} đơn đặt sân?`,
      async () => {
        try {
          if (action === 'delete') {
            await Promise.all(selectedBookings.map(id => bookingService.deleteBooking(id)));
          } else {
            await Promise.all(selectedBookings.map(id => bookingService.updateBookingStatus(id, action)));
          }
          showToast(`${actionText[action]} thành công ${selectedBookings.length} đơn`, 'success');
          setSelectedBookings([]);
          await loadData();
        } catch (error) {
          showToast(`Không thể ${actionText[action]} đơn đặt sân`, 'error');
        }
      }
    );
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
    <div className="space-y-4 md:space-y-6 p-3 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý đặt sân
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tất cả đơn đặt sân trong hệ thống
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => openModal('booking')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-sm"
          >
            <i className="fas fa-plus"></i>
            <span>Thêm đơn</span>
          </button>
          
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <BookingStats bookings={bookings} />

      {/* Filters */}
      <BookingFilters
        filters={filters}
        fields={fields}
        onFilterChange={handleFilterChange}
      />

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <BulkActions
          selectedCount={selectedBookings.length}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner message="Đang tải danh sách đặt sân..." />
          </div>
        ) : (
          <>
            <BookingTable
              bookings={bookings}
              loading={false}
              selectedBookings={selectedBookings}
              onSelectBooking={handleSelectBooking}
              onSelectAll={handleSelectAll}
              onStatusUpdate={handleStatusUpdate}
              onEdit={(booking) => openModal('booking', booking)}
              onDelete={handleDelete}
            />
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
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
      {modals.booking && (
        <BookingModal
          booking={editingBooking}
          fields={fields}
          onSave={handleSaveBooking}
          onClose={() => closeModal('booking')}
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

export default AdminBookingManagement;