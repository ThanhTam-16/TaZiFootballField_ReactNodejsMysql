// backend/controllers/contactController.js
const { Resend } = require('resend');

const resendApiKey = process.env.RESEND_API_KEY;
let resend = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn(
    '[contactController] RESEND_API_KEY chưa được cấu hình. Email liên hệ sẽ chỉ được log ra console.'
  );
}

exports.sendContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const toEmail =
      process.env.CONTACT_RECEIVER_EMAIL ||
      'nguyenthanhtam10062004@gmail.com';

    const fromEmail =
      process.env.EMAIL_FROM ||
      process.env.OTP_FROM_EMAIL ||
      'TaZiFootball <no-reply@tzbookstore.id.vn>';

    // Nếu chưa set RESEND_API_KEY thì chỉ log (dev)
    if (!resend) {
      console.log('='.repeat(60));
      console.log('📧 SIMULATED CONTACT EMAIL');
      console.log('To      :', toEmail);
      console.log('From    :', fromEmail);
      console.log('Subject :', subject);
      console.log('Name    :', name);
      console.log('Email   :', email);
      console.log('Message :', message);
      console.log('Time    :', new Date().toLocaleString());
      console.log('='.repeat(60));
      return res.json({ message: 'Gửi liên hệ (simulate) thành công.' });
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `[Liên hệ - ${subject}] từ ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Liên hệ mới từ TaZiFootball</h2>
          <p><strong>Họ tên:</strong> ${name}</p>
          <p><strong>Email khách:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Chủ đề:</strong> ${subject}</p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
          <p><strong>Nội dung:</strong></p>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
      `,
      // để bạn reply thẳng tới khách
      reply_to: email,
    });

    if (error) {
      console.error('[contactController] Resend error:', error);
      return res
        .status(500)
        .json({ message: 'Không thể gửi email liên hệ. Vui lòng thử lại sau.' });
    }

    console.log('[contactController] Contact email sent. id =', data?.id);
    return res.json({ message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.' });
  } catch (err) {
    console.error('[contactController] Unexpected error:', err);
    return res
      .status(500)
      .json({ message: 'Đã xảy ra lỗi khi gửi liên hệ. Vui lòng thử lại sau.' });
  }
};
