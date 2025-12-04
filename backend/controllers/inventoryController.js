// backend/controllers/inventoryController.js - Inventory Management
const Product = require('../models/Product'); 
const StockTransaction = require('../models/StockTransaction'); 

exports.getProducts = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      stock_status: req.query.stock_status,
      limit: req.query.limit
    };

    const products = await Product.getAll(filters);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách sản phẩm' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin sản phẩm' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productId = await Product.create(req.body);
    const newProduct = await Product.getById(productId);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã sản phẩm đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi tạo sản phẩm' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const result = await Product.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    
    const updatedProduct = await Product.getById(req.params.id);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật sản phẩm' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await Product.softDelete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Lỗi xóa sản phẩm' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Product.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê tồn kho' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { products, transaction_date, reference, notes } = req.body;
    const admin_id = req.admin.id;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Danh sách sản phẩm không hợp lệ' });
    }

    const transactionIds = [];
    for (const item of products) {
      const { product_id, quantity, type } = item;
      const product = await Product.getById(product_id);
      
      if (!product) {
        return res.status(400).json({ error: `Sản phẩm ID ${product_id} không tồn tại` });
      }

      const price = type === 'import' ? product.purchase_price : product.selling_price;
      
      const transactionId = await StockTransaction.create({
        product_id,
        type,
        quantity,
        price,
        transaction_date,
        reference,
        notes,
        created_by: admin_id
      });

      await Product.updateStock(product_id, quantity, type);
      transactionIds.push(transactionId);
    }

    res.status(201).json({ 
      message: 'Giao dịch thành công',
      transaction_ids: transactionIds
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Lỗi tạo giao dịch' });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      product_id: req.query.product_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      limit: req.query.limit || 20
    };

    const transactions = await StockTransaction.getAll(filters);
    res.json(transactions);
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ error: 'Lỗi lấy lịch sử giao dịch' });
  }
};

exports.quickStockUpdate = async (req, res) => {
  try {
    const { product_id, quantity, type } = req.body;
    const admin_id = req.admin.id;

    if (!product_id || !quantity || !type) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const product = await Product.getById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    const price = type === 'import' ? product.purchase_price : product.selling_price;
    await StockTransaction.create({
      product_id,
      type,
      quantity,
      price,
      transaction_date: new Date().toISOString().split('T')[0],
      reference: `Quick ${type}`,
      notes: `Quick ${type} via admin panel`,
      created_by: admin_id
    });

    const newStock = await Product.updateStock(product_id, quantity, type);

    res.json({ 
      message: 'Cập nhật tồn kho thành công',
      new_stock: newStock
    });
  } catch (error) {
    console.error('Quick stock update error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật tồn kho' });
  }
};