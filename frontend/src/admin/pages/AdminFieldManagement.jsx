// ====== frontend/src/admin/pages/AdminFieldManagement.jsx (OPTIMIZED) ======
import { useState, useEffect } from 'react';
import { fieldService, bookingService } from '../services';
import FieldDateNavigation from '../components/field/FieldDateNavigation';
import FieldViewControls from '../components/field/FieldViewControls';
import FieldTimeline from '../components/field/FieldTimeline';
import FieldList from '../components/field/FieldList';
import FieldLegend from '../components/field/FieldLegend';
import BookingDetailModal from '../components/field/BookingDetailModal';
import CreateBookingModal from '../components/field/CreateBookingModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const AdminFieldManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fieldsData, setFieldsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('timeline');
  const [filters, setFilters] = useState({
    fieldType: 'all',
    status: 'all'
  });

  // Modal states
  const [modals, setModals] = useState({
    bookingDetail: false,
    createBooking: false
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadFieldData();
  }, [currentDate]);

  const loadFieldData = async () => {
    try {
      setLoading(true);
      const dateStr = formatDateForAPI(currentDate);
      const data = await fieldService.getFieldsWithBookings(dateStr);
      setFieldsData(data || []);
    } catch (error) {
      console.error('Error loading field data:', error);
      showToast('Không thể tải dữ liệu sân', 'error');
      setFieldsData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleTimeSlotClick = (fieldId, hour, booking = null) => {
    if (booking) {
      setSelectedBooking(booking);
      openModal('bookingDetail');
    } else {
      setSelectedSlot({ fieldId, hour, date: currentDate });
      openModal('createBooking');
    }
  };

  const openModal = (modalType, data = null) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'bookingDetail') {
      setSelectedBooking(null);
    } else if (modalType === 'createBooking') {
      setSelectedSlot(null);
    }
  };

  const handleBookingAction = async (action, bookingId) => {
    try {
      setLoading(true);
      
      switch (action) {
        case 'approve':
          await bookingService.updateBookingStatus(bookingId, 'approved');
          showToast('Đã duyệt booking', 'success');
          break;
        case 'cancel':
          await bookingService.deleteBooking(bookingId);
          showToast('Đã hủy booking', 'warning');
          break;
        case 'complete':
          await bookingService.updateBookingStatus(bookingId, 'completed');
          showToast('Đã hoàn thành booking', 'success');
          break;
      }
      
      closeModal('bookingDetail');
      await loadFieldData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi xử lý booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      await bookingService.createManualBooking(bookingData);
      showToast('Tạo booking thành công!', 'success');
      closeModal('createBooking');
      await loadFieldData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi tạo booking', 'error');
    }
  };

  if (loading && fieldsData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Đang tải dữ liệu sân..." />
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            Quản lý sân
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Xem lịch đặt sân và quản lý hoạt động sân bóng
          </p>
        </div>
        
        <div className='flex'>
          <button 
          onClick={loadFieldData}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 text-xs disabled:opacity-50"
        >
          <i className={`fas fa-sync-alt text-xs ${loading ? 'animate-spin' : ''}`}></i>
          <span className="hidden sm:inline">Làm mới</span>
        </button>
        </div>
        
      </div>  

      {/* Date Navigation */}
      <FieldDateNavigation
        currentDate={currentDate}
        onChangeDate={changeDate}
        onGoToToday={goToToday}
        formatDate={formatDateForDisplay}
      />

      {/* View Controls */}
      <FieldViewControls
        currentView={currentView}
        filters={filters}
        onViewChange={setCurrentView}
        onFilterChange={setFilters}
        onRefresh={loadFieldData}
        loading={loading}
      />

      {/* Legend - Compact */}
      <FieldLegend />

      {/* Content Views */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <LoadingSpinner message="Đang tải..." />
          </div>
        ) : fieldsData.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-calendar-times text-gray-400 text-lg"></i>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Không có dữ liệu sân
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Không thể tải dữ liệu sân cho ngày này
            </p>
          </div>
        ) : currentView === 'timeline' ? (
          <FieldTimeline
            fieldsData={fieldsData}
            onTimeSlotClick={handleTimeSlotClick}
            filters={filters}
          />
        ) : (
          <FieldList
            fieldsData={fieldsData}
            currentDate={currentDate}
            onBookingClick={(booking) => {
              setSelectedBooking(booking);
              openModal('bookingDetail');
            }}
            filters={filters}
          />
        )}
      </div>

      {/* Modals */}
      {modals.bookingDetail && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          fieldsData={fieldsData}
          currentDate={currentDate}
          onAction={handleBookingAction}
          onClose={() => closeModal('bookingDetail')}
        />
      )}

      {modals.createBooking && selectedSlot && (
        <CreateBookingModal
          slot={selectedSlot}
          fieldsData={fieldsData}
          onSave={handleCreateBooking}
          onClose={() => closeModal('createBooking')}
        />
      )}
    </div>
  );
};

export default AdminFieldManagement;