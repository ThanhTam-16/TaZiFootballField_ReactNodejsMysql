// ====== frontend/src/admin/pages/AdminDashboard.jsx (OPTIMIZED - COMPACT) ======
import { useState, useEffect } from 'react';
import { dashboardService } from '../services';
import DashboardStats from '../components/dashboard/DashboardStats';
import RevenueChart from '../components/dashboard/RevenueChart';
import PopularFieldsChart from '../components/dashboard/PopularFieldsChart';
import BookingStatusChart from '../components/dashboard/BookingStatusChart';
import HourlyBookingChart from '../components/dashboard/HourlyBookingChart';
import FieldTypeRevenueChart from '../components/dashboard/FieldTypeRevenueChart';
import RecentBookings from '../components/dashboard/RecentBookings';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    today_revenue: 0,
    today_bookings: 0,
    pending_bookings: 0,
    total_fields: 0,
    total_users: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chartPeriod, setChartPeriod] = useState(7);

  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsResult, bookingsResult] = await Promise.allSettled([
        dashboardService.getStatsOnly(),
        dashboardService.getRecentBookings(5)
      ]);

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      }
      
      if (bookingsResult.status === 'fulfilled') {
        setRecentBookings(bookingsResult.value || []);
      }
    } catch (error) {
      console.error('Dashboard loading error:', error);
      showToast('Không thể tải dữ liệu dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboardData();
      showToast('Đã cập nhật dữ liệu', 'success');
    } catch (error) {
      showToast('Lỗi khi cập nhật', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Đang tải dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Tổng quan hoạt động hệ thống
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Period Selector - Compact */}
          <select
            value={chartPeriod}
            onChange={(e) => setChartPeriod(Number(e.target.value))}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>7 ngày</option>
            <option value={14}>14 ngày</option>
            <option value={30}>30 ngày</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-xs font-medium disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt text-xs ${refreshing ? 'animate-spin' : ''}`}></i>
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Compact */}
      <DashboardStats stats={stats} />

      {/* Charts Grid - Optimized Layout */}
      <div className="space-y-4">
        {/* Revenue & Status Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RevenueChart days={chartPeriod} />
          </div>
          <div className="lg:col-span-1">
            <BookingStatusChart />
          </div>
        </div>

        {/* Popular Fields & Hourly Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PopularFieldsChart />
          <HourlyBookingChart />
        </div>

        {/* Field Revenue & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <FieldTypeRevenueChart />
          </div>
          <div className="lg:col-span-2">
            <RecentBookings 
              bookings={recentBookings} 
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;