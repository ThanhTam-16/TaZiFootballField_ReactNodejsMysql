// ====== frontend/src/admin/components/dashboard/FieldTypeRevenueChart.jsx (OPTIMIZED - COMPACT) ======
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { dashboardService } from '../../services';

const FieldTypeRevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const FIELD_TYPE_CONFIG = {
    '5vs5': { color: '#3b82f6', icon: 'fas fa-futbol', name: 'Sân 5vs5' },
    '7vs7': { color: '#10b981', icon: 'fas fa-football-ball', name: 'Sân 7vs7' },
    '11vs11': { color: '#8b5cf6', icon: 'fas fa-trophy', name: 'Sân 11vs11' }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getFieldTypeRevenue();
      
      console.log('Field type revenue data:', result); // Debug log
      
      const formattedData = result.map(item => ({
        name: FIELD_TYPE_CONFIG[item.type]?.name || `Sân ${item.type}`,
        type: item.type,
        value: parseFloat(item.total_revenue || 0) / 1000000,
        bookings: parseInt(item.booking_count || 0),
        color: FIELD_TYPE_CONFIG[item.type]?.color || '#6b7280',
        icon: FIELD_TYPE_CONFIG[item.type]?.icon || 'fas fa-futbol'
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error('Error loading field type revenue:', error);
      // Fallback data
      setData([
        { name: 'Sân 5vs5', type: '5vs5', value: 8.5, bookings: 65, color: '#3b82f6', icon: 'fas fa-futbol' },
        { name: 'Sân 7vs7', type: '7vs7', value: 12.2, bookings: 48, color: '#10b981', icon: 'fas fa-football-ball' },
        { name: 'Sân 11vs11', type: '11vs11', value: 15.8, bookings: 32, color: '#8b5cf6', icon: 'fas fa-trophy' }
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
            {payload[0].name}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 mb-1">
            Doanh thu: <strong>{payload[0].value.toFixed(2)}M VND</strong>
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Lượt đặt: <strong>{payload[0].payload.bookings}</strong>
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

  const totalRevenue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-chart-pie text-white text-sm"></i>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Doanh thu loại sân
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            30 ngày qua
          </p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
          <i className="fas fa-futbol text-2xl mb-2 opacity-50"></i>
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
          <div className="mt-3 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <i className={item.icon} style={{ color: item.color, fontSize: '10px' }}></i>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.value.toFixed(1)}M
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {((item.value / totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Revenue */}
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Tổng doanh thu
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
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