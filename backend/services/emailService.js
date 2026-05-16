const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
});

async function sendPriceAlert(email, username, metalName, price) {
  const mailOptions = {
    from: '金属价格提醒 <n*********@***********',
    to: email,
    subject: `${metalName}价格变动提醒`,
    html: `
      <h3>尊敬的${username}，您好！</h3>
      <p>您关注的${metalName}价格已达到您设定的阈值。</p>
      <p>当前价格: <strong>${price}</strong></p>
      <p>请登录系统查看详情。</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`价格提醒邮件已发送至 ${email}`);
  } catch (error) {
    console.error('发送邮件失败:', error);
  }
}

module.exports = { sendPriceAlert };
