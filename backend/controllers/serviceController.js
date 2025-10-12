// backend/controllers/serviceController.js - Service Management
const Service = require('../models/Service'); // [NOTE] Cần models

// =============== CUSTOMER SERVICE APIs ===============
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.json(services);
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ error: 'Không lấy được dịch vụ' });
  }
};

exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.getByCategory(category);
    res.json(services);
  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({ error: 'Không lấy được theo loại' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.getById(id);
    
    if (!service) {
      return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Get service by id error:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin dịch vụ' });
  }
};

// =============== ADMIN SERVICE MANAGEMENT ===============
exports.createService = async (req, res) => {
  try {
    const { name, category, price, description, is_available } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const serviceData = {
      name,
      category,
      price,
      description,
      is_available: is_available !== undefined ? is_available : true
    };

    const result = await Service.create(serviceData);
    res.status(201).json({ 
      message: 'Tạo dịch vụ thành công', 
      serviceId: result.insertId 
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Lỗi tạo dịch vụ' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await Service.update(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
    }

    res.json({ message: 'Cập nhật dịch vụ thành công' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật dịch vụ' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Service.softDelete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
    }

    res.json({ message: 'Xóa dịch vụ thành công' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Lỗi xóa dịch vụ' });
  }
};

exports.getServiceStats = async (req, res) => {
  try {
    const stats = await Service.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get service stats error:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê dịch vụ' });
  }
};