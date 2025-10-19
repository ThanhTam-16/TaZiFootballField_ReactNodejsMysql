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
  const [chartPeriod, setChartPeriod] = useState(7); // 7, 14, 30 days

  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      if (stats.pending_bookings === 0 && recentBookings.length === 0) {
        setLoading(true);
      }
      
      const bookingsPromise = dashboardService.getRecentBookings(5)
        .then(result => {
          setRecentBookings(result || []);
          return result;
        })
        .catch(error => {
          console.error('Bookings loading failed:', error);
          setRecentBookings([]);
          return [];
        });
      
      const statsPromise = dashboardService.getStatsOnly()
        .then(result => {
          setStats(result);
          return result;
        })
        .catch(error => {
          console.error('Stats loading failed:', error);
          return stats;
        });
      
      await Promise.allSettled([statsPromise, bookingsPromise]);
      
    } catch (error) {
      console.error('Dashboard loading error:', error);
      showToast('Dashboard đã tải với dữ liệu cơ bản', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
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
      
      showToast('Đã cập nhật dữ liệu', 'success');
    } catch (error) {
      showToast('Lỗi khi cập nhật', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && recentBookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Đang tải dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header với Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tổng quan hoạt động hệ thống
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Period Selector */}
          <select
            value={chartPeriod}
            onChange={(e) => setChartPeriod(Number(e.target.value))}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>7 ngày qua</option>
            <option value={14}>14 ngày qua</option>
            <option value={30}>30 ngày qua</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt ${refreshing ? 'animate-spin' : ''}`}></i>
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Revenue & Booking Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - 2 cols */}
        <div className="lg:col-span-2">
          <RevenueChart days={chartPeriod} />
        </div>

        {/* Booking Status Chart - 1 col */}
        <div className="lg:col-span-1">
          <BookingStatusChart />
        </div>
      </div>

      {/* Popular Fields & Hourly Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularFieldsChart />
        <HourlyBookingChart />
      </div>

      {/* Field Type Revenue & Recent Bookings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Type Revenue - 1 col */}
        <div className="lg:col-span-1">
          <FieldTypeRevenueChart />
        </div>

        {/* Recent Bookings - 2 cols */}
        <div className="lg:col-span-2">
          <RecentBookings 
            bookings={recentBookings} 
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;