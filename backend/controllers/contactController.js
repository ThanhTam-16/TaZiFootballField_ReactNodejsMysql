// backend/controllers/contactController.js
const nodemailer = require('nodemailer');

exports.sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // hoặc smtp.ethereal.email để test miễn phí
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.MAIL_RECEIVER,
      subject: `[Liên hệ] ${subject}`,
      html: `
        <p><strong>Họ tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Nội dung:</strong><br/>${message}</p>
      `
    });

    res.status(200).json({ message: 'Gửi thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gửi email thất bại' });
  }
};
