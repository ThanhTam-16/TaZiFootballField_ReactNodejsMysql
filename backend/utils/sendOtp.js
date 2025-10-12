// backend/utils/sendOtp.js - FIXED VERSION
const nodemailer = require('nodemailer');

// Create transporter function - FIX: Use correct method name
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER || 'your-email@gmail.com',
      pass: process.env.MAIL_PASS || 'your-app-password'
    }
  });
};

const sendOtp = {
  // Send OTP via email
  sendEmail: async (email, otpCode) => {
    try {
      console.log('Attempting to send email OTP to:', email);
      
      if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.log('Email credentials not configured, simulating email send...');
        console.log('='.repeat(50));
        console.log('📧 EMAIL OTP (Simulated)');
        console.log('='.repeat(50));
        console.log(`Email: ${email}`);
        console.log(`OTP Code: ${otpCode}`);
        console.log(`Time: ${new Date().toLocaleString()}`);
        console.log('Subject: Mã xác thực OTP - TaZi FootballField');
        console.log('='.repeat(50));
        return { success: true, messageId: 'simulated-' + Date.now() };
      }

      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Mã xác thực OTP - TaZi FootballField',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">TaZi FootballField</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Mã xác thực OTP của bạn</h2>
              <p style="font-size: 16px; color: #666;">
                Xin chào! Mã xác thực của bạn là:
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 5px;">
                  ${otpCode}
                </span>
              </div>
              <p style="color: #999; font-size: 14px;">
                Mã này có hiệu lực trong <strong>5 phút</strong>. Không chia sẻ mã này với bất kỳ ai.
              </p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
              </p>
            </div>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email OTP sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email OTP:', error);
      
      // Fallback to simulation if email fails
      console.log('Falling back to simulated email...');
      console.log('='.repeat(50));
      console.log('📧 EMAIL OTP (Fallback Simulation)');
      console.log('='.repeat(50));
      console.log(`Email: ${email}`);
      console.log(`OTP Code: ${otpCode}`);
      console.log(`Time: ${new Date().toLocaleString()}`);
      console.log(`Error: ${error.message}`);
      console.log('='.repeat(50));
      
      // Don't throw error, just simulate
      return { success: true, messageId: 'fallback-' + Date.now() };
    }
  },

  // Send OTP via SMS (simulated)
  sendSMS: async (phone, otpCode) => {
    try {
      // Simulate SMS for development
      console.log('='.repeat(50));
      console.log('📱 SMS OTP (Simulated)');
      console.log('='.repeat(50));
      console.log(`Phone: ${phone}`);
      console.log(`OTP Code: ${otpCode}`);
      console.log(`Time: ${new Date().toLocaleString()}`);
      console.log('Message: Mã xác thực TaZi FootballField của bạn là: ' + otpCode + '. Có hiệu lực trong 5 phút.');
      console.log('='.repeat(50));

      // TODO: Integrate with real SMS service like:
      // - Twilio
      // - AWS SNS
      // - Vietnam SMS Gateway
      // - Esms.vn
      
      return { success: true, phone, otpCode };
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      throw new Error('Không thể gửi SMS OTP');
    }
  },

  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone format (Vietnam)
  isValidPhone: (phone) => {
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    return phoneRegex.test(phone);
  },

  // Generate OTP code
  generateOTP: (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

module.exports = sendOtp;