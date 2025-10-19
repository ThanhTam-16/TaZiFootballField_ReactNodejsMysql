import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../services';

const HourlyBookingChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getHourlyBookingChart();
      
      // Fill missing hours with 0
      const hourlyData = [];
      for (let i = 6; i <= 22; i++) {
        const existingData = result.find(item => parseInt(item.hour) === i);
        hourlyData.push({
          hour: `${i}h`,
          bookings: existingData ? parseInt(existingData.booking_count) : 0
        });
      }
      
      setData(hourlyData);
    } catch (error) {
      console.error('Error loading hourly booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Khung giờ {payload[0].payload.hour}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {payload[0].value} lượt đặt
          </p>
        </div>
      );
    }
    return null;
  };

  // Find peak hour
  const peakHour = data.reduce((max, item) => 
    item.bookings > max.bookings ? item : max
  , { hour: '', bookings: 0 });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-clock text-white"></i>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Phân bổ theo giờ
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lượt đặt theo khung giờ
            </p>
          </div>
        </div>

        {/* Peak Hour Badge */}
        {peakHour.bookings > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <i className="fas fa-crown text-amber-600 dark:text-amber-400 text-sm"></i>
            <div className="text-right">
              <p className="text-xs text-gray-600 dark:text-gray-400">Giờ cao điểm</p>
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {peakHour.hour}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-gray-500 dark:text-gray-400">
          <i className="fas fa-clock text-4xl mb-3 opacity-50"></i>
          <p>Chưa có dữ liệu</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="hour" 
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="bookings" 
              fill="#f59e0b"
              radius={[8, 8, 0, 0]}
              name="Lượt đặt"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HourlyBookingChart;