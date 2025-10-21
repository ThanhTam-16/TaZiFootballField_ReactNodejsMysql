// ====== frontend/src/admin/components/dashboard/BookingStatusChart.jsx (OPTIMIZED - COMPACT) ======
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { dashboardService } from '../../services';

const BookingStatusChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const STATUS_CONFIG = {
    pending: { 
      name: 'Chờ duyệt', 
      color: '#f59e0b',
      icon: 'fas fa-clock'
    },
    approved: { 
      name: 'Đã duyệt', 
      color: '#10b981',
      icon: 'fas fa-check-circle'
    },
    completed: { 
      name: 'Hoàn thành', 
      color: '#3b82f6',
      icon: 'fas fa-flag-checkered'
    },
    cancelled: { 
      name: 'Đã hủy', 
      color: '#ef4444',
      icon: 'fas fa-times-circle'
    }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getBookingStatusChart();
      
      console.log('Booking status data:', result); // Debug log
      
      const formattedData = result.map(item => ({
        name: STATUS_CONFIG[item.status]?.name || item.status,
        value: parseInt(item.count || 0),
        color: STATUS_CONFIG[item.status]?.color || '#6b7280',
        icon: STATUS_CONFIG[item.status]?.icon || 'fas fa-circle'
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error('Error loading booking status:', error);
      // Fallback data
      setData([
        { name: 'Chờ duyệt', value: 8, color: '#f59e0b', icon: 'fas fa-clock' },
        { name: 'Đã duyệt', value: 25, color: '#10b981', icon: 'fas fa-check-circle' },
        { name: 'Hoàn thành', value: 42, color: '#3b82f6', icon: 'fas fa-flag-checkered' },
        { name: 'Đã hủy', value: 5, color: '#ef4444', icon: 'fas fa-times-circle' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-xs">
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            {payload[0].name}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {payload[0].value} đơn ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const totalBookings = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-chart-pie text-white text-sm"></i>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Trạng thái đặt sân
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            30 ngày qua
          </p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
          <i className="fas fa-chart-pie text-2xl mb-2 opacity-50"></i>
          <p className="text-xs">Chưa có dữ liệu</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Stats Summary */}
          <div className="mt-3 space-y-1">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {((item.value / totalBookings) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingStatusChart;