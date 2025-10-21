// ====== frontend/src/admin/pages/AdminInventoryManagement.jsx (OPTIMIZED - COMPACT) ======
import { useState, useEffect, useCallback } from 'react';
import inventoryService from '../services/inventoryService';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryFilters from '../components/inventory/InventoryFilters';
import ProductGrid from '../components/inventory/ProductGrid';
import ProductTable from '../components/inventory/ProductTable';
import ProductModal from '../components/inventory/ProductModal';
import ProductDetailModal from '../components/inventory/ProductDetailModal';
import ConfirmModal from '../components/common/ConfirmModal';
import BulkActions from '../components/inventory/BulkActions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const AdminInventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    stock_status: 'all'
  });

  // Modals
  const [modals, setModals] = useState({
    product: false,
    detail: false,
    confirm: false
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

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

  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedProducts([]);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      stock_status: 'all'
    });
    setSelectedProducts([]);
  };

  // Selection handlers
  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedProducts(checked ? products.map(p => p.id) : []);
  };

  // Modal handlers
  const openModal = (modalType, data = null) => {
    if (modalType === 'product') {
      setEditingProduct(data);
    } else if (modalType === 'detail') {
      setSelectedProductDetail(data);
    }
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'product') {
      setEditingProduct(null);
    } else if (modalType === 'detail') {
      setSelectedProductDetail(null);
    }
  };

  // CRUD operations
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await inventoryService.updateProduct(editingProduct.id, productData);
        showToast('Cập nhật sản phẩm thành công', 'success');
      } else {
        await inventoryService.createProduct(productData);
        showToast('Tạo sản phẩm thành công', 'success');
      }
      closeModal('product');
      await fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra';
      showToast(errorMessage, 'error');
    }
  };

  const handleViewProductDetail = async (productId) => {
    try {
      const productDetail = await inventoryService.getProduct(productId);
      openModal('detail', productDetail);
    } catch (error) {
      showToast('Không thể tải thông tin sản phẩm', 'error');
    }
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    showConfirm(
      `Bạn có chắc chắn muốn xóa sản phẩm ${product?.name}?`,
      async () => {
        try {
          await inventoryService.deleteProduct(productId);
          showToast('Xóa sản phẩm thành công', 'success');
          await fetchData();
        } catch (error) {
          showToast('Không thể xóa sản phẩm', 'error');
        }
      }
    );
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

  // Bulk operations
  const handleBulkAction = (action) => {
    if (selectedProducts.length === 0) return;
    
    const actionText = {
      delete: 'xóa',
      export: 'xuất Excel'
    };

    showConfirm(
      `Bạn có chắc chắn muốn ${actionText[action]} ${selectedProducts.length} sản phẩm?`,
      async () => {
        try {
          if (action === 'delete') {
            await Promise.all(selectedProducts.map(id => 
              inventoryService.deleteProduct(id)
            ));
          }
          showToast(`${actionText[action]} thành công ${selectedProducts.length} sản phẩm`, 'success');
          setSelectedProducts([]);
          await fetchData();
        } catch (error) {
          showToast(`Không thể ${actionText[action]} sản phẩm`, 'error');
        }
      }
    );
  };

  const handleExportProducts = () => {
    if (selectedProducts.length === 0) return;
    
    const selectedData = products.filter(p => selectedProducts.includes(p.id));
    // TODO: Implement export to CSV/Excel
    console.log('Exporting products:', selectedData);
    showToast(`Xuất Excel thành công ${selectedProducts.length} sản phẩm`, 'success');
  };

  // Confirm helper
  const showConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    openModal('confirm');
  };

  const handleConfirm = () => {
    closeModal('confirm');
    if (confirmAction) confirmAction();
    setConfirmAction(null);
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
    if (!price || isNaN(price)) return '0 ₫';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 space-y-4">
        
        {/* Header - Compact */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Quản lý tồn kho
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Quản lý sản phẩm và theo dõi tồn kho
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => openModal('product')}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 text-xs"
            >
              <i className="fas fa-plus text-xs"></i>
              <span>Thêm sản phẩm</span>
            </button>

            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 text-xs disabled:opacity-50"
            >
              <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <InventoryStats stats={stats} formatPrice={formatPrice} />

        {/* Low Stock Alert */}
        {stats.low_stock > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 rounded flex items-center justify-center flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-amber-600 dark:text-amber-400 text-xs"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Có <strong>{stats.low_stock}</strong> sản phẩm sắp hết hàng. Cần nhập thêm hàng sớm.
                </p>
              </div>
              <button 
                onClick={() => handleFilterChange({ ...filters, stock_status: 'low-stock' })}
                className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded transition-colors duration-200 whitespace-nowrap"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        )}

        {/* Filters and View Toggle */}
        <div className="space-y-3">
          <InventoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            getCategoryText={getCategoryText}
            onAddProduct={() => openModal('product')}
          />

          {/* View Toggle - Moved below filters */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Hiển thị <strong>{products.length}</strong> sản phẩm
            </div>
            <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded transition-colors duration-200 text-xs ${
                  view === 'grid'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Xem dạng lưới"
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded transition-colors duration-200 text-xs ${
                  view === 'list'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Xem dạng danh sách"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <BulkActions
            selectedCount={selectedProducts.length}
            onBulkAction={handleBulkAction}
            onExport={handleExportProducts}
          />
        )}

        {/* Products Display */}
        {products.length === 0 && !loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-box-open text-gray-400"></i>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Không có sản phẩm nào
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
            </p>
          </div>
        ) : view === 'grid' ? (
          <ProductGrid
            products={products}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            getCategoryText={getCategoryText}
            getStockStatusText={getStockStatusText}
            formatPrice={formatPrice}
            onViewDetail={handleViewProductDetail}
            onQuickImport={handleQuickImport}
            onQuickExport={handleQuickExport}
            onEditProduct={(product) => openModal('product', product)}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        ) : (
          <ProductTable
            products={products}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            getCategoryText={getCategoryText}
            getStockStatusText={getStockStatusText}
            formatPrice={formatPrice}
            onViewDetail={handleViewProductDetail}
            onQuickImport={handleQuickImport}
            onQuickExport={handleQuickExport}
            onEditProduct={(product) => openModal('product', product)}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        )}
      </div>

      {/* Modals */}
      {modals.product && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => closeModal('product')}
        />
      )}

      {modals.detail && selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          formatPrice={formatPrice}
          getCategoryText={getCategoryText}
          getStockStatusText={getStockStatusText}
          onClose={() => closeModal('detail')}
          onEdit={() => {
            closeModal('detail');
            openModal('product', selectedProductDetail);
          }}
        />
      )}

      {modals.confirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={handleConfirm}
          onCancel={() => closeModal('confirm')}
        />
      )}
    </div>
  );
};

export default AdminInventoryManagement;