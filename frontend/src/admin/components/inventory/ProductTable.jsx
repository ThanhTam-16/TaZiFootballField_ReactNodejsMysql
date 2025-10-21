// ====== frontend/src/admin/components/inventory/ProductTable.jsx (OPTIMIZED - FIXED) ======
import { useState } from 'react';

const ProductTable = ({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
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
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStockStatusColor = (status) => {
    const colors = {
      'in-stock': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      'low-stock': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
      'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {[...Array(7)].map((_, index) => (
                  <th key={index} className="px-3 py-2 text-left">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700 animate-pulse">
                  {[...Array(7)].map((_, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2">
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <th className="px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                ID
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Sản phẩm
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Danh mục
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Giá
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Tồn kho
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Trạng thái
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              const isHovered = hoveredRow === product.id;
              const stockPercentage = product.max_stock > 0 ? Math.round((product.current_stock / product.max_stock) * 100) : 0;

              return (
                <tr
                  key={product.id}
                  className={`transition-colors duration-150 cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onMouseEnter={() => setHoveredRow(product.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onViewDetail(product.id)}
                >
                  {/* Checkbox */}
                  <td className="px-3 py-2 whitespace-nowrap">
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
                  </td>
                  
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">#{product.id}</span>
                  </td>

                  {/* Product Info */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
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
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate max-w-[100px]">
                          #{product.code}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {getCategoryText(product.category)}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice(product.selling_price || product.price)}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>{product.current_stock || 0}</span>
                          <span>{stockPercentage}%</span>
                        </div>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              product.stock_status === 'out-of-stock' ? 'bg-red-500' :
                              product.stock_status === 'low-stock' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${stockPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
                      {getStockStatusText(product.stock_status)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickImport(product.id);
                        }}
                        className="w-6 h-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded flex items-center justify-center transition-colors duration-200 text-xs"
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
                        className="w-6 h-6 bg-amber-500 hover:bg-amber-600 text-white rounded flex items-center justify-center transition-colors duration-200 text-xs disabled:opacity-50"
                        title="Xuất hàng nhanh"
                      >
                        <i className="fas fa-arrow-up"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(product);
                        }}
                        className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center transition-colors duration-200 text-xs"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {products.map((product) => {
          const isSelected = selectedProducts.includes(product.id);
          const stockPercentage = product.max_stock > 0 ? Math.round((product.current_stock / product.max_stock) * 100) : 0;

          return (
            <div
              key={product.id}
              className={`p-3 transition-colors duration-150 $$
                isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
              }`}
              onClick={() => onViewDetail(product.id)}
            >
              <div className="flex items-start space-x-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product.id, e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer mt-1 flex-shrink-0"
                />
               
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-2">#{product.id}</span>

                {/* Product Image */}
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <i className="fas fa-box text-gray-400"></i>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">
                        #{product.code}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
                      {getStockStatusText(product.stock_status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Danh mục:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {getCategoryText(product.category)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Giá:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {formatPrice(product.selling_price || product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Stock Progress */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Tồn kho: {product.current_stock || 0}</span>
                      <span>{stockPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          product.stock_status === 'out-of-stock' ? 'bg-red-500' :
                          product.stock_status === 'low-stock' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickImport(product.id);
                        }}
                        className="w-6 h-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded flex items-center justify-center transition-colors duration-200 text-xs"
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
                        className="w-6 h-6 bg-amber-500 hover:bg-amber-600 text-white rounded flex items-center justify-center transition-colors duration-200 text-xs disabled:opacity-50"
                        title="Xuất hàng nhanh"
                      >
                        <i className="fas fa-arrow-up"></i>
                      </button>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(product);
                        }}
                        className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center transition-colors duration-200 text-xs"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProduct(product.id);
                        }}
                        className="w-6 h-6 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded flex items-center justify-center transition-colors duration-200 text-xs"
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTable;