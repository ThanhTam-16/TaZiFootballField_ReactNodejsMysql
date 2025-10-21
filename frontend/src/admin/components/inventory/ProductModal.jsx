// ====== frontend/src/admin/components/inventory/ProductModal.jsx (OPTIMIZED - COMPACT) ======
import { useState, useEffect } from 'react';

const ProductModal = ({ product, onSave, onClose }) => {
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'soft-drink',
    price: '',
    cost: '',
    current_stock: 0,
    min_stock: 5,
    max_stock: 100,
    description: '',
    image: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        code: product.code || '',
        category: product.category || 'soft-drink',
        price: product.selling_price || product.price || '',
        cost: product.cost || '',
        current_stock: product.current_stock || 0,
        min_stock: product.min_stock || 5,
        max_stock: product.max_stock || 100,
        description: product.description || '',
        image: product.image || ''
      });
    }
    setErrors({});
  }, [product]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên sản phẩm phải có ít nhất 2 ký tự';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Mã sản phẩm là bắt buộc';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Mã sản phẩm chỉ được chứa chữ hoa, số, gạch dưới và gạch ngang';
    }

    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Giá bán phải lớn hơn 0';
    }

    if (formData.cost && (isNaN(formData.cost) || formData.cost < 0)) {
      newErrors.cost = 'Giá nhập không hợp lệ';
    }

    if (isNaN(formData.current_stock) || formData.current_stock < 0) {
      newErrors.current_stock = 'Tồn kho không được âm';
    }

    if (isNaN(formData.min_stock) || formData.min_stock < 0) {
      newErrors.min_stock = 'Tồn kho tối thiểu không được âm';
    }

    if (isNaN(formData.max_stock) || formData.max_stock <= 0) {
      newErrors.max_stock = 'Tồn kho tối đa phải lớn hơn 0';
    }

    if (formData.max_stock <= formData.min_stock) {
      newErrors.max_stock = 'Tồn kho tối đa phải lớn hơn tồn kho tối thiểu';
    }

    if (formData.image && !/^https?:\/\/.+\..+/.test(formData.image)) {
      newErrors.image = 'URL hình ảnh không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'soft-drink', label: 'Nước ngọt' },
    { value: 'energy-drink', label: 'Nước tăng lực' },
    { value: 'water', label: 'Nước suối' },
    { value: 'tea', label: 'Trà' },
    { value: 'snack', label: 'Đồ ăn nhẹ' },
    { value: 'equipment', label: 'Thiết bị' }
  ];

  const getStockStatus = () => {
    const stock = parseInt(formData.current_stock) || 0;
    const minStock = parseInt(formData.min_stock) || 5;
    
    if (stock <= 0) return { status: 'out-of-stock', text: 'Hết hàng', color: 'text-red-600' };
    if (stock <= minStock) return { status: 'low-stock', text: 'Sắp hết', color: 'text-amber-600' };
    return { status: 'in-stock', text: 'Còn hàng', color: 'text-emerald-600' };
  };

  const stockStatus = getStockStatus();
  const stockPercentage = formData.max_stock > 0 ? Math.round(((formData.current_stock || 0) / formData.max_stock) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
              <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus'} text-blue-600 dark:text-blue-400 text-xs`}></i>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEditing ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm mới vào kho'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Product Code */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mã sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  errors.code 
                    ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="VD: PROD_001"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.code}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giá bán <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">₫</span>
                  </div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className={`w-full pl-6 pr-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.price 
                        ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Giá nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">₫</span>
                </div>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleChange('cost', e.target.value)}
                  className={`w-full pl-6 pr-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.cost 
                      ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
              {errors.cost && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.cost}</p>
              )}
            </div>

            {/* Stock Configuration */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-3 space-y-3">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                Quản lý tồn kho
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    value={formData.current_stock}
                    onChange={(e) => handleChange('current_stock', parseInt(e.target.value) || 0)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.current_stock 
                        ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Tối thiểu
                  </label>
                  <input
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) => handleChange('min_stock', parseInt(e.target.value) || 0)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.min_stock 
                        ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.max_stock}
                    onChange={(e) => handleChange('max_stock', parseInt(e.target.value) || 100)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.max_stock 
                        ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                    min="1"
                  />
                </div>
              </div>

              {/* Stock Status Display */}
              <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Trạng thái:</span>
                    <span className={`ml-1 text-xs font-semibold ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.current_stock} / {formData.max_stock} ({stockPercentage}%)
                  </div>
                </div>
                
                {/* Stock Progress Bar */}
                <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${stockStatus.color.replace('text', 'bg')}`}
                    style={{ width: `${stockPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Stock Errors */}
              {(errors.current_stock || errors.min_stock || errors.max_stock) && (
                <div className="space-y-1">
                  {errors.current_stock && <p className="text-xs text-red-600 dark:text-red-400">{errors.current_stock}</p>}
                  {errors.min_stock && <p className="text-xs text-red-600 dark:text-red-400">{errors.min_stock}</p>}
                  {errors.max_stock && <p className="text-xs text-red-600 dark:text-red-400">{errors.max_stock}</p>}
                </div>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL hình ảnh
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  errors.image 
                    ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.image}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả sản phẩm
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200 disabled:opacity-50 flex items-center space-x-1"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>{isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;