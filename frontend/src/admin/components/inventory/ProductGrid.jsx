// ====== frontend/src/admin/components/inventory/ProductGrid.jsx (OPTIMIZED - FIXED) ======
import { useState } from 'react';

const ProductGrid = ({
  products,
  selectedProducts,
  onSelectProduct,
  getCategoryText,
  getStockStatusText,
  formatPrice,
  onViewDetail,
  onQuickImport,
  onQuickExport,
  onEditProduct,
  onDeleteProduct,
  loading = false
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const getStockStatusColor = (status) => {
    const colors = {
      'in-stock': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      'low-stock': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
      'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'soft-drink': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'energy-drink': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'water': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
      'tea': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'snack': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'equipment': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 animate-pulse">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((product) => {
        const isSelected = selectedProducts.includes(product.id);
        const isHovered = hoveredCard === product.id;
        const stockPercentage = product.max_stock > 0 ? Math.round((product.current_stock / product.max_stock) * 100) : 0;

        return (
          <div
            key={product.id}
            className={`group relative bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 cursor-pointer ${
              isSelected 
                ? 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
            onMouseEnter={() => setHoveredCard(product.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onViewDetail(product.id)}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectProduct(product.id, e.target.checked);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Quick Actions Overlay */}
            <div className={`absolute top-2 right-2 z-10 flex space-x-1 transition-all duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickImport(product.id);
                }}
                className="w-6 h-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded flex items-center justify-center transition-colors duration-200 text-xs shadow-sm"
                title="Nhập hàng nhanh"
              >
                <i className="fas fa-arrow-down"></i>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickExport(product.id);
                }}
                disabled={!product.current_stock || product.current_stock === 0}
                className="w-6 h-6 bg-amber-500 hover:bg-amber-600 text-white rounded flex items-center justify-center transition-colors duration-200 text-xs shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xuất hàng nhanh"
              >
                <i className="fas fa-arrow-up"></i>
              </button>
            </div>

            {/* Product Header */}
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <i className="fas fa-box text-gray-400 text-sm"></i>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                    #{product.code}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(product.category)}`}>
                  {getCategoryText(product.category)}
                </span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
                  {getStockStatusText(product.stock_status)}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              {/* Price */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatPrice(product.selling_price || product.price)}
                </span>
                <span className={`text-xs font-medium ${
                  product.current_stock <= (product.min_stock || 5) 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {product.current_stock || 0} sản phẩm
                </span>
              </div>

              {/* Stock Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Tồn kho</span>
                  <span>{stockPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      product.stock_status === 'out-of-stock' ? 'bg-red-500' :
                      product.stock_status === 'low-stock' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetail(product.id);
                  }}
                  className="flex-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <i className="fas fa-eye text-xs"></i>
                  <span>Chi tiết</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProduct(product);
                  }}
                  className="px-2 py-1.5 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium transition-colors duration-200"
                  title="Chỉnh sửa"
                >
                  <i className="fas fa-edit text-xs"></i>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProduct(product.id);
                  }}
                  className="px-2 py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium transition-colors duration-200"
                  title="Xóa"
                >
                  <i className="fas fa-trash text-xs"></i>
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