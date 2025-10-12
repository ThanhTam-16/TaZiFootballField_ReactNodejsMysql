// backend/utils/sendEmail.js - Email Utility
const nodemailer = require('nodemailer');

// Cấu hình transporter cho email
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
};

const sendEmail = {
  // Gửi email liên hệ từ contact form
  sendContactForm: async ({ from, to, subject, name, email, message }) => {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.MAIL_USER, // Gửi từ email hệ thống
        to: to || process.env.MAIL_RECEIVER || process.env.MAIL_USER,
        replyTo: email, // Cho phép reply về email của khách hàng
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Liên Hệ Từ Website</h2>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Thông Tin Liên Hệ</h3>
              <p><strong>Họ tên:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4CAF50;">
              <h3 style="margin-top: 0; color: #333;">Nội Dung Tin Nhắn</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Hướng dẫn trả lời:</strong><br>
                - Nhấn "Reply" để trả lời trực tiếp cho khách hàng<br>
                - Email khách hàng: <a href="mailto:${email}">${email}</a>
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Email này được gửi tự động từ hệ thống TaZi FootballField Contact Form.
            </p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Contact email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending contact email:', error);
      throw new Error('Không thể gửi email liên hệ');
    }
  },

  // Gửi email thông báo booking
  sendBookingNotification: async (bookingData) => {
    try {
      const transporter = createTransporter();
      
      const { userEmail, userName, fieldName, bookingDate, startTime, endTime, totalAmount, bookingId } = bookingData;
      
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: userEmail,
        subject: 'Xác nhận đặt sân thành công - TaZi FootballField',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Xác Nhận Đặt Sân Thành Công</h2>
            
            <p>Xin chào <strong>${userName}</strong>,</p>
            <p>Cảm ơn bạn đã đặt sân tại TaZi FootballField. Đây là thông tin đặt sân của bạn:</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Chi Tiết Đặt Sân</h3>
              <p><strong>Mã đặt sân:</strong> #${bookingId}</p>
              <p><strong>Sân:</strong> ${fieldName}</p>
              <p><strong>Ngày:</strong> ${bookingDate}</p>
              <p><strong>Giờ:</strong> ${startTime} - ${endTime}</p>
              <p><strong>Tổng tiền:</strong> ${totalAmount.toLocaleString()} VNĐ</p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #2e7d32;">
                <strong>Lưu ý:</strong> Vui lòng có mặt trước giờ đá 15 phút để làm thủ tục check-in.
              </p>
            </div>
            
            <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
            <p>Chúc bạn có trận đấu vui vẻ!</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              TaZi FootballField<br>
              Email: ${process.env.MAIL_USER}<br>
              Website: https://tazi-football.com
            </p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Booking notification sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending booking notification:', error);
      throw new Error('Không thể gửi email thông báo booking');
    }
  },

  // Gửi email reset password (tương lai)
  sendPasswordReset: async (email, resetToken) => {
    try {
      const transporter = createTransporter();
      
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Đặt lại mật khẩu - TaZi FootballField',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Đặt Lại Mật Khẩu</h2>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
            <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Đặt Lại Mật Khẩu
              </a>
            </div>
            
            <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Không thể gửi email đặt lại mật khẩu');
    }
  }
};

module.exports = sendEmail;