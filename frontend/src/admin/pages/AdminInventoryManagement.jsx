// ====== frontend/src/admin/pages/AdminInventoryManagement.jsx (OPTIMIZED MOBILE VERSION) ======
import { useState, useEffect, useCallback } from 'react';
import inventoryService from '../services/inventoryService';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryFilters from '../components/inventory/InventoryFilters';
import ProductGrid from '../components/inventory/ProductGrid';
import ProductTable from '../components/inventory/ProductTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const AdminInventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    stock_status: 'all'
  });

  const { showToast } = useToast();

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, statsData] = await Promise.all([
        inventoryService.getProducts(filters),
        inventoryService.getStats()
      ]);
      setProducts(productsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      showToast('Lỗi tải dữ liệu tồn kho', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      stock_status: 'all'
    });
  };

  // Quick stock actions
  const handleQuickImport = async (productId) => {
    try {
      await inventoryService.quickStockUpdate(productId, 10, 'import');
      await fetchData();
      showToast('Nhập hàng thành công!', 'success');
    } catch (error) {
      showToast('Lỗi nhập hàng: ' + error.message, 'error');
    }
  };

  const handleQuickExport = async (productId) => {
    try {
      await inventoryService.quickStockUpdate(productId, 1, 'export');
      await fetchData();
      showToast('Xuất hàng thành công!', 'success');
    } catch (error) {
      showToast('Lỗi xuất hàng: ' + error.message, 'error');
    }
  };

  // Utility functions
  const getCategoryText = (category) => {
    const categories = {
      'soft-drink': 'Nước ngọt',
      'energy-drink': 'Nước tăng lực',
      'water': 'Nước suối',
      'tea': 'Trà',
      'snack': 'Đồ ăn nhẹ',
      'equipment': 'Thiết bị'
    };
    return categories[category] || 'Khác';
  };

  const getStockStatusText = (status) => {
    const statuses = {
      'in-stock': 'Còn hàng',
      'low-stock': 'Sắp hết',
      'out-of-stock': 'Hết hàng'
    };
    return statuses[status] || 'Không xác định';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Đang tải dữ liệu tồn kho..." />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý tồn kho
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Quản lý sản phẩm và theo dõi tồn kho
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Toggle - Now visible on mobile */}
            <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  view === 'grid'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Xem dạng lưới"
              >
                <i className="fas fa-th text-sm"></i>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  view === 'list'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Xem dạng danh sách"
              >
                <i className="fas fa-list text-sm"></i>
              </button>
            </div>
            
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center justify-center p-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm disabled:opacity-50"
              title="Làm mới"
            >
              <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
              <span className="hidden md:inline ml-2">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <InventoryStats stats={stats} formatPrice={formatPrice} />

        {/* Low Stock Alert */}
        {stats.low_stock > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-amber-600 dark:text-amber-400 text-sm"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Cảnh báo tồn kho thấp
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Có {stats.low_stock} sản phẩm sắp hết hàng. Cần nhập thêm hàng sớm.
                </p>
              </div>
              <button 
                onClick={() => handleFilterChange('stock_status', 'low-stock')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <InventoryFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          getCategoryText={getCategoryText}
        />

        {/* Products Display */}
        {products.length === 0 && !loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-box-open text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có sản phẩm nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
            </p>
          </div>
        ) : view === 'grid' ? (
          <ProductGrid
            products={products}
            getCategoryText={getCategoryText}
            getStockStatusText={getStockStatusText}
            formatPrice={formatPrice}
            onQuickImport={handleQuickImport}
            onQuickExport={handleQuickExport}
            loading={loading}
          />
        ) : (
          <ProductTable
            products={products}
            getCategoryText={getCategoryText}
            getStockStatusText={getStockStatusText}
            formatPrice={formatPrice}
            onQuickImport={handleQuickImport}
            onQuickExport={handleQuickExport}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default AdminInventoryManagement;