// ====== frontend/src/admin/components/inventory/ProductGrid.jsx ======
import { SkeletonCard } from '../common/LoadingSpinner';

const ProductGrid = ({ 
  products, 
  getCategoryText, 
  getStockStatusText, 
  formatPrice, 
  onQuickImport, 
  onQuickExport,
  loading 
}) => {
  const getStockStatusConfig = (status) => {
    const configs = {
      'in-stock': {
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
        icon: 'fas fa-check-circle'
      },
      'low-stock': {
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
        icon: 'fas fa-exclamation-triangle'
      },
      'out-of-stock': {
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: 'fas fa-times-circle'
      }
    };
    return configs[status] || configs['in-stock'];
  };

  const getCategoryColor = (category) => {
    const colors = {
      'soft-drink': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'energy-drink': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'water': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
      'tea': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'snack': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'equipment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const statusConfig = getStockStatusConfig(product.stock_status);
        
        return (
          <div 
            key={product.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 group"
          >
            {/* Product Image/Icon */}
            <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <i className="fas fa-box text-3xl text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform duration-300"></i>
              
              {/* Stock Status Badge */}
              <div className={`absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                <i className={`${statusConfig.icon} mr-1`}></i>
                <span className="hidden sm:inline">{getStockStatusText(product.stock_status)}</span>
                <span className="sm:hidden">
                  {product.stock_status === 'in-stock' ? 'OK' : 
                   product.stock_status === 'low-stock' ? 'Low' : 'Out'}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Product Code & Category */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {product.code}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                  {getCategoryText(product.category)}
                </span>
              </div>

              {/* Product Name */}
              <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 leading-tight">
                {product.name}
              </h3>

              {/* Stock Info */}
              <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tồn kho</div>
                  <div className={`font-bold text-sm ${
                    product.stock_status === 'in-stock' ? 'text-emerald-600 dark:text-emerald-400' :
                    product.stock_status === 'low-stock' ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {product.current_stock} {product.unit}
                  </div>
                </div>
              </div>

              {/* Prices - Hidden on Mobile */}
              <div className="hidden sm:grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Giá nhập</div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {formatPrice(product.purchase_price)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Giá bán</div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {formatPrice(product.selling_price)}
                  </div>
                </div>
              </div>

              {/* Mobile: Selling Price Only */}
              <div className="sm:hidden mb-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Giá bán</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(product.selling_price)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-1">
                <button
                  className="flex-1 p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 text-xs font-medium"
                  title="Xem chi tiết"
                >
                  <i className="fas fa-eye"></i>
                  <span className="hidden sm:inline ml-1">Xem</span>
                </button>
                
                <button
                  onClick={() => onQuickImport(product.id)}
                  className="flex-1 p-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 text-xs font-medium"
                  title="Nhập hàng"
                >
                  <i className="fas fa-plus"></i>
                  <span className="hidden sm:inline ml-1">Nhập</span>
                </button>
                
                <button
                  onClick={() => onQuickExport(product.id)}
                  disabled={product.current_stock === 0}
                  className="flex-1 p-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Xuất hàng"
                >
                  <i className="fas fa-minus"></i>
                  <span className="hidden sm:inline ml-1">Xuất</span>
                </button>
                
                <button
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  title="Chỉnh sửa"
                >
                  <i className="fas fa-edit text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;