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
      
      const formattedData = result.map(item => ({
        name: item.name,
        bookings: parseInt(item.booking_count),
        revenue: parseFloat(item.total_revenue) / 1000000 // Convert to millions
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error('Error loading popular fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Lượt đặt: {payload[0].value}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Doanh thu: {payload[1]?.value.toFixed(2)}M VND
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-fire text-white"></i>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sân phổ biến
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Top 5 sân được đặt nhiều nhất
          </p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-gray-500 dark:text-gray-400">
          <i className="fas fa-futbol text-4xl mb-3 opacity-50"></i>
          <p>Chưa có dữ liệu</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              yAxisId="left"
              dataKey="bookings" 
              fill="#3b82f6" 
              radius={[8, 8, 0, 0]}
              name="Lượt đặt"
            />
            <Bar 
              yAxisId="right"
              dataKey="revenue" 
              fill="#10b981" 
              radius={[8, 8, 0, 0]}
              name="Doanh thu (M)"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PopularFieldsChart;