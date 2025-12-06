// backend/utils/sendOtp.js - VERSION dùng Resend
const { Resend } = require('resend');

// Khởi tạo client Resend
const resendApiKey = process.env.RESEND_API_KEY;
let resend = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn(
    '[sendOtp] RESEND_API_KEY chưa được cấu hình. OTP email sẽ chỉ được log (simulate).'
  );
}

const sendOtp = {
  // Gửi OTP qua email dùng Resend
  sendEmail: async (email, otpCode) => {
    try {
      console.log('Attempting to send email OTP to:', email);

      // Nếu chưa cấu hình API key → simulate (cho dev/test)
      if (!resend) {
        console.log('='.repeat(50));
        console.log('📧 SIMULATED EMAIL OTP (no RESEND_API_KEY)');
        console.log('To:', email);
        console.log('OTP:', otpCode);
        console.log('Time:', new Date().toLocaleString());
        console.log('='.repeat(50));

        return {
          success: true,
          simulated: true,
        };
      }

      const fromEmail =
        process.env.OTP_FROM_EMAIL || 'TaZiFootball <onboarding@resend.dev>';

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Mã xác thực OTP - TaZiFootball',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">TaZiFootball</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Mã xác thực OTP của bạn</h2>
              <p style="font-size: 16px; color: #666;">
                Xin chào! Mã xác thực của bạn là:
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111;">
                  ${otpCode}
                </span>
              </div>
              <p style="font-size: 14px; color: #999;">
                Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.
              </p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #aaa;">
              © ${new Date().getFullYear()} TaZiFootball. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('[sendOtp] Error from Resend:', error);
        // fallback simulate, tránh làm hỏng flow người dùng
        console.log('='.repeat(50));
        console.log('📧 FALLBACK SIMULATED EMAIL OTP (Resend error)');
        console.log('To:', email);
        console.log('OTP:', otpCode);
        console.log('Time:', new Date().toLocaleString());
        console.log('='.repeat(50));

        return {
          success: true,
          simulated: true,
        };
      }

      console.log('[sendOtp] Email OTP sent via Resend. id =', data?.id);
      return {
        success: true,
        id: data?.id || null,
      };
    } catch (err) {
      console.error('[sendOtp] Unexpected error when sending OTP email:', err);

      // fallback simulate
      console.log('='.repeat(50));
      console.log('📧 FALLBACK SIMULATED EMAIL OTP (exception)');
      console.log('To:', email);
      console.log('OTP:', otpCode);
      console.log('Time:', new Date().toLocaleString());
      console.log('='.repeat(50));

      return {
        success: true,
        simulated: true,
      };
    }
  },

  // Tạm thời chỉ simulate SMS, khi nào dùng Twilio/esms thì implement sau
  sendSMS: async (phone, otpCode) => {
    console.log('='.repeat(50));
    console.log('📱 SIMULATED SMS OTP');
    console.log('Phone:', phone);
    console.log('OTP:', otpCode);
    console.log('Time:', new Date().toLocaleString());
    console.log('='.repeat(50));

    return {
      success: true,
      simulated: true,
    };
  },

  // Validate email
  isValidEmail: (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },

  // Validate phone (VN)
  isValidPhone: (phone) => {
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    return phoneRegex.test(phone);
  },

  // Generate OTP code
  generateOTP: (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

module.exports = sendOtp;
