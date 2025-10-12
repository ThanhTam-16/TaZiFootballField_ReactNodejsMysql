// ====== frontend/src/admin/components/inventory/ProductTable.jsx ======
import { SkeletonTableRow } from '../common/LoadingSpinner';

const ProductTable = ({ 
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

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mã SP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tồn kho</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá bán</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <SkeletonTableRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {products.map((product) => {
          const statusConfig = getStockStatusConfig(product.stock_status);
          
          return (
            <div 
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-box text-white text-sm"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {product.code}
                    </p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                  <i className={`${statusConfig.icon} mr-1`}></i>
                  {getStockStatusText(product.stock_status)}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Danh mục</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {getCategoryText(product.category)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tồn kho</div>
                  <div className={`text-sm font-bold ${
                    product.stock_status === 'in-stock' ? 'text-emerald-600 dark:text-emerald-400' :
                    product.stock_status === 'low-stock' ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {product.current_stock} {product.unit}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Giá bán</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(product.selling_price)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200">
                  <i className="fas fa-eye mr-1"></i>
                  Xem
                </button>
                <button 
                  onClick={() => onQuickImport(product.id)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors duration-200"
                >
                  <i className="fas fa-plus mr-1"></i>
                  Nhập
                </button>
                <button 
                  onClick={() => onQuickExport(product.id)}
                  disabled={product.current_stock === 0}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                  <i className="fas fa-minus mr-1"></i>
                  Xuất
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mã SP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Giá nhập
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Giá bán
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-box-open text-gray-400 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Không có sản phẩm nào
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const statusConfig = getStockStatusConfig(product.stock_status);
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {product.code}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {getCategoryText(product.category)}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`font-bold ${
                          product.stock_status === 'in-stock' ? 'text-emerald-600 dark:text-emerald-400' :
                          product.stock_status === 'low-stock' ? 'text-amber-600 dark:text-amber-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {product.current_stock}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {product.unit}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPrice(product.purchase_price)}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPrice(product.selling_price)}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                          <i className={`${statusConfig.icon} mr-1`}></i>
                          {getStockStatusText(product.stock_status)}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="flex space-x-1">
                          <button
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye text-xs"></i>
                          </button>
                          <button
                            onClick={() => onQuickImport(product.id)}
                            className="p-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200"
                            title="Nhập hàng"
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </button>
                          <button
                            onClick={() => onQuickExport(product.id)}
                            disabled={product.current_stock === 0}
                            className="p-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xuất hàng"
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            title="Xóa"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductTable;