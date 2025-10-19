import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { dashboardService } from '../../services';

const FieldTypeRevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const FIELD_TYPE_CONFIG = {
    '5vs5': { color: '#3b82f6', icon: 'fas fa-futbol' },
    '7vs7': { color: '#10b981', icon: 'fas fa-football-ball' },
    '11vs11': { color: '#8b5cf6', icon: 'fas fa-trophy' }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getFieldTypeRevenue();
      
      const formattedData = result.map(item => ({
        name: `Sân ${item.type}`,
        type: item.type,
        value: parseFloat(item.total_revenue) / 1000000, // Convert to millions
        bookings: parseInt(item.booking_count),
        color: FIELD_TYPE_CONFIG[item.type]?.color || '#6b7280'
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error('Error loading field type revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {payload[0].name}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Doanh thu: {payload[0].value.toFixed(2)}M VND
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Lượt đặt: {payload[0].payload.bookings}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null; // Don't show label for small slices

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

  const totalRevenue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-chart-pie text-white"></i>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Doanh thu loại sân
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            30 ngày qua
          </p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-gray-500 dark:text-gray-400">
          <i className="fas fa-futbol text-4xl mb-3 opacity-50"></i>
          <p>Chưa có dữ liệu</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={90}
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
          <div className="mt-6 space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <i className={`${FIELD_TYPE_CONFIG[item.type]?.icon} text-lg`} style={{ color: item.color }}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.bookings} lượt đặt
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.value.toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {((item.value / totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Revenue */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tổng doanh thu
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {totalRevenue.toFixed(2)}M VND
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FieldTypeRevenueChart;