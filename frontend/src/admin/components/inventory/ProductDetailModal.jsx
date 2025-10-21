// ====== frontend/src/admin/components/inventory/ProductDetailModal.jsx (OPTIMIZED - FIXED) ======
const ProductDetailModal = ({ product, formatPrice, getCategoryText, getStockStatusText, onClose, onEdit }) => {
  if (!product) return null;

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

  const stockPercentage = product.max_stock > 0 ? Math.round(((product.current_stock || 0) / product.max_stock) * 100) : 0;
  const profit = product.cost ? (product.selling_price || product.price) - product.cost : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
              <i className="fas fa-box text-blue-600 dark:text-blue-400 text-sm"></i>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Chi tiết sản phẩm
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Thông tin đầy đủ về sản phẩm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Product Header */}
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center flex-shrink-0">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
              ) : (
                <i className="fas fa-box text-gray-400"></i>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-1 mb-2">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(product.category)}`}>
                  {getCategoryText(product.category)}
                </span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
                  {getStockStatusText(product.stock_status)}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 font-mono">
                  #{product.code}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.selling_price || product.price)}
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Thông tin tồn kho
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <div className="text-gray-500 dark:text-gray-400">Tồn kho hiện tại</div>
                <div className={`font-semibold ${
                  (product.current_stock || 0) <= (product.min_stock || 5) 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {product.current_stock || 0} sản phẩm
                </div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Tồn kho tối thiểu</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {product.min_stock || 5} sản phẩm
                </div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Tồn kho tối đa</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {product.max_stock || 100} sản phẩm
                </div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Tỷ lệ tồn kho</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {stockPercentage}%
                </div>
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Mức độ tồn kho</span>
                <span>{product.current_stock || 0} / {product.max_stock || 100}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    product.stock_status === 'out-of-stock' ? 'bg-red-500' :
                    product.stock_status === 'low-stock' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${stockPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Thông tin tài chính
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Giá bán</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(product.selling_price || product.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Giá nhập</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {product.cost ? formatPrice(product.cost) : 'Chưa cập nhật'}
                  </span>
                </div>
                {profit !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Lợi nhuận ước tính</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(profit)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Tổng giá trị tồn kho</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatPrice((product.selling_price || product.price) * (product.current_stock || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Mô tả sản phẩm
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-3">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 mr-2"
          >
            Đóng
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200 flex items-center space-x-1"
          >
            <i className="fas fa-edit text-xs"></i>
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;