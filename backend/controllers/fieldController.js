// backend/controllers/fieldController.js
const Field = require('../models/Field');

// =============== CUSTOMER FIELD APIs ===============

exports.getAllFields = async (req, res) => {
  try {
    console.log('Getting all fields...');
    const fields = await Field.getAllAsync();
    console.log(`Found ${fields.length} fields`);
    res.json(fields);
  } catch (error) {
    console.error('Get all fields error:', error);
    res.status(500).json({
      error: 'Lỗi khi lấy danh sách sân',
      details: error.message,
    });
  }
};

exports.getAvailableFields = async (req, res) => {
  try {
    const { date, start, end, types } = req.query;

    console.log('Getting available fields with params:', {
      date,
      start,
      end,
      types,
    });

    if (!date || !start || !end || !types) {
      return res.status(400).json({
        error: 'Thiếu tham số bắt buộc: date, start, end, types',
      });
    }

    const fields = await Field.getAvailableAsync(
      date,
      start,
      end,
      types
    );

    console.log(`Returning ${fields.length} available fields`);
    res.json(fields);
  } catch (error) {
    console.error('Get available fields error:', error);
    res.status(500).json({
      error: 'Lỗi truy vấn sân trống',
      details: error.message,
    });
  }
};

// =============== ADMIN FIELD MANAGEMENT ===============

exports.getFieldsForAdmin = async (req, res) => {
  try {
    console.log('Getting fields for admin...');
    const results = await Field.getAllWithStats();
    console.log(`Found ${results.length} fields for admin`);
    res.json(results);
  } catch (error) {
    console.error('Get fields for admin error:', error);
    res.status(500).json({
      error: 'Lỗi lấy danh sách sân',
      details: error.message,
    });
  }
};

exports.createField = async (req, res) => {
  try {
    const { name, type, price_per_hour, description, facilities } =
      req.body;

    if (!name || !type || !price_per_hour) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    console.log('Creating field:', { name, type, price_per_hour });

    const result = await Field.create({
      name,
      type,
      price_per_hour,
      description,
      facilities,
    });

    console.log('Field created with ID:', result.insertId);

    res.status(201).json({
      message: 'Tạo sân thành công',
      fieldId: result.insertId,
    });
  } catch (error) {
    console.error('Create field error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Tên sân đã tồn tại' });
    }
    res.status(500).json({
      error: 'Lỗi tạo sân',
      details: error.message,
    });
  }
};

exports.updateField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const {
      name,
      type,
      price_per_hour,
      description,
      facilities,
      is_active,
    } = req.body;

    console.log(`Updating field ${fieldId}:`, req.body);

    const result = await Field.update(fieldId, {
      name,
      type,
      price_per_hour,
      description,
      facilities,
      is_active,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sân' });
    }

    console.log('Field updated successfully');
    res.json({ message: 'Cập nhật sân thành công' });
  } catch (error) {
    console.error('Update field error:', error);
    res.status(500).json({
      error: 'Lỗi cập nhật sân',
      details: error.message,
    });
  }
};

exports.getFieldsWithBookings = async (req, res) => {
  try {
    const date =
      req.query.date || new Date().toISOString().split('T')[0];

    console.log(`Getting fields with bookings for date: ${date}`);

    const rows = await Field.getWithBookingsByDate(date);

    const fieldsMap = new Map();
    rows.forEach((row) => {
      if (!fieldsMap.has(row.id)) {
        fieldsMap.set(row.id, {
          id: row.id,
          name: row.name,
          type: row.type,
          price_per_hour: row.price_per_hour,
          bookings: [],
        });
      }

      if (row.booking_id) {
        fieldsMap.get(row.id).bookings.push({
          id: row.booking_id,
          start_time: row.start_time,
          end_time: row.end_time,
          status: row.status,
          customer_name: row.customer_name,
          phone_number: row.phone_number,
        });
      }
    });

    const fieldsList = Array.from(fieldsMap.values());
    console.log(
      `Found ${fieldsList.length} fields with booking data`
    );

    res.json(fieldsList);
  } catch (error) {
    console.error('Get fields with bookings error:', error);
    res.status(500).json({
      error: 'Lỗi lấy danh sách sân với lịch đặt',
      details: error.message,
    });
  }
};

exports.getFieldById = async (req, res) => {
  try {
    const { fieldId } = req.params;

    console.log(`Getting field by ID: ${fieldId}`);

    const field = await Field.findById(fieldId);

    if (!field) {
      return res.status(404).json({ error: 'Không tìm thấy sân' });
    }

    res.json(field);
  } catch (error) {
    console.error('Get field by ID error:', error);
    res.status(500).json({
      error: 'Lỗi khi lấy thông tin sân',
      details: error.message,
    });
  }
};

// Soft delete
exports.deleteField = async (req, res) => {
  try {
    const { fieldId } = req.params;

    console.log(`Deleting field: ${fieldId}`);

    const result = await Field.softDelete(fieldId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sân' });
    }

    console.log('Field deleted successfully');
    res.json({ message: 'Xóa sân thành công' });
  } catch (error) {
    console.error('Delete field error:', error);
    res.status(500).json({
      error: 'Lỗi khi xóa sân',
      details: error.message,
    });
  }
};
