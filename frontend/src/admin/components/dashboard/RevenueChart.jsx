import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../services';

const RevenueChart = ({ days = 7 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('area'); // 'line' or 'area'

  useEffect(() => {
    loadChartData();
  }, [days]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getRevenueChart(days);
      
      // Format data for chart
      const formattedData = result.map(item => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        revenue: parseFloat(item.revenue) / 1000, // Convert to thousands
        bookings: parseInt(item.bookings)
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error('Error loading revenue chart:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `${value}K`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {payload[0].payload.date}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Doanh thu: {payload[0].value.toFixed(0)}K VND
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Đặt sân: {payload[1]?.value || 0} đơn
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-white"></i>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Doanh thu & Đặt sân
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {days} ngày gần đây
            </p>
          </div>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              chartType === 'area'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <i className="fas fa-chart-area mr-1"></i>
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <i className="fas fa-chart-line mr-1"></i>
            Line
          </button>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-gray-500 dark:text-gray-400">
          <i className="fas fa-chart-line text-4xl mb-3 opacity-50"></i>
          <p>Chưa có dữ liệu</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={formatCurrency}
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
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Doanh thu (K)"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorBookings)"
                name="Số đơn"
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={formatCurrency}
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
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
                name="Doanh thu (K)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Số đơn"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;