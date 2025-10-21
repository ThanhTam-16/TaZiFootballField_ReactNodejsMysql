// ====== frontend/src/admin/components/dashboard/PopularFieldsChart.jsx (OPTIMIZED - COMPACT) ======
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../services';

const PopularFieldsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getPopularFields();
      
      console.log('Popular fields data:', result); // Debug log
      
      const formattedData = result.map(item => ({
        name: item.name?.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
        fullName: item.name,
        bookings: parseInt(item.booking_count || 0),
        revenue: parseFloat(item.total_revenue || 0) / 1000000
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error('Error loading popular fields:', error);
      // Fallback data
      setData([
        { name: 'Sân A', fullName: 'Sân bóng A', bookings: 45, revenue: 12.5 },
        { name: 'Sân B', fullName: 'Sân bóng B', bookings: 38, revenue: 10.2 },
        { name: 'Sân C', fullName: 'Sân bóng C', bookings: 32, revenue: 8.7 },
        { name: 'Sân D', fullName: 'Sân bóng D', bookings: 28, revenue: 7.4 },
        { name: 'Sân E', fullName: 'Sân bóng E', bookings: 22, revenue: 5.9 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-xs">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {payload[0].payload.fullName}
          </p>
          <p className="text-blue-600 dark:text-blue-400 mb-1">
            Lượt đặt: <strong>{payload[0].value}</strong>
          </p>
          <p className="text-emerald-600 dark:text-emerald-400">
            Doanh thu: <strong>{payload[1]?.value?.toFixed(2) || 0}M VND</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-fire text-white text-sm"></i>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Sân phổ biến
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Top 5 sân được đặt nhiều
          </p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
          <i className="fas fa-futbol text-2xl mb-2 opacity-50"></i>
          <p className="text-xs">Chưa có dữ liệu</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              style={{ fontSize: '10px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9ca3af"
              style={{ fontSize: '10px' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              style={{ fontSize: '10px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '10px',
                fontSize: '10px'
              }}
              iconType="circle"
            />
            <Bar 
              yAxisId="left"
              dataKey="bookings" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              name="Lượt đặt"
            />
            <Bar 
              yAxisId="right"
              dataKey="revenue" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              name="Doanh thu (M)"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PopularFieldsChart;