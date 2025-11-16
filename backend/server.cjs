const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fixmyareas@gmail.com",
    pass: "tiepmcpbmfzocgar",
  },
});

// ========== OTP ENDPOINTS ==========

app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  const mailOptions = {
    from: "FixMyArea <fixmyareas@gmail.com>",
    to: email,
    subject: "🔐 Your FixMyArea Registration OTP",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; }
          .email-container { max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
          .header { background: rgba(255,255,255,0.1); padding: 30px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2); }
          .logo { font-size: 28px; font-weight: bold; color: #ffffff; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
          .content { background: #ffffff; padding: 40px 30px; text-align: center; }
          .greeting { font-size: 20px; color: #333; margin-bottom: 20px; font-weight: 600; }
          .message { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 30px; }
          .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px 30px; border-radius: 12px; display: inline-block; margin: 20px 0; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4); }
          .note { font-size: 13px; color: #999; margin-top: 25px; line-height: 1.5; }
          .footer { background: #f8f9fa; padding: 25px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0; }
          .footer a { color: #667eea; text-decoration: none; font-weight: 600; }
          .icon { font-size: 48px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">🏙️ FixMyArea</div>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Empowering Communities Together</p>
          </div>
          <div class="content">
            <div class="icon">🔐</div>
            <div class="greeting">Welcome to FixMyArea!</div>
            <div class="message">Thank you for registering with <strong>FixMyArea</strong>. To complete your registration, please use the OTP code below:</div>
            <div class="otp-box">${otp}</div>
            <div class="note">⏱️ This OTP is valid for <strong>5 minutes</strong>.<br>🚫 Do not share this code with anyone.<br>❓ If you didn't request this, please ignore this email.</div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">Need help? Contact us at <a href="mailto:fixmyareas@gmail.com">fixmyareas@gmail.com</a></p>
            <p style="margin: 0; color: #aaa;">© 2025 FixMyArea. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #bbb;">Making Communities Better, Together 🌟</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ verified: false, message: "Email and OTP required" });
  }

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];
    res.json({ verified: true, message: "OTP verified successfully" });
  } else {
    res.json({ verified: false, message: "Invalid or expired OTP" });
  }
});

// ========== PASSWORD RESET ENDPOINTS ==========

app.post("/api/send-reset-link", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[`reset_${email}`] = resetToken;

  const mailOptions = {
    from: "FixMyArea <fixmyareas@gmail.com>",
    to: email,
    subject: "🔒 Reset Your FixMyArea Password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; }
          .email-container { max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
          .header { background: rgba(255,255,255,0.1); padding: 30px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2); }
          .logo { font-size: 28px; font-weight: bold; color: #ffffff; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
          .content { background: #ffffff; padding: 40px 30px; text-align: center; }
          .greeting { font-size: 20px; color: #333; margin-bottom: 20px; font-weight: 600; }
          .message { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 30px; }
          .token-box { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px 30px; border-radius: 12px; display: inline-block; margin: 20px 0; box-shadow: 0 8px 20px rgba(240, 147, 251, 0.4); }
          .note { font-size: 13px; color: #999; margin-top: 25px; line-height: 1.5; }
          .footer { background: #f8f9fa; padding: 25px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0; }
          .footer a { color: #f5576c; text-decoration: none; font-weight: 600; }
          .icon { font-size: 48px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">🏙️ FixMyArea</div>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Password Reset Request</p>
          </div>
          <div class="content">
            <div class="icon">🔒</div>
            <div class="greeting">Reset Your Password</div>
            <div class="message">We received a request to reset your password for <strong>FixMyArea</strong>. Use the code below to proceed:</div>
            <div class="token-box">${resetToken}</div>
            <div class="note">⏱️ This code is valid for <strong>10 minutes</strong>.<br>🚫 Do not share this code with anyone.<br>❓ If you didn't request this, please ignore this email.</div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">Need help? Contact us at <a href="mailto:fixmyareas@gmail.com">fixmyareas@gmail.com</a></p>
            <p style="margin: 0; color: #aaa;">© 2025 FixMyArea. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #bbb;">Making Communities Better, Together 🌟</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset code sent to ${email}: ${resetToken}`);
    res.json({ success: true, message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ success: false, message: "Failed to send reset email" });
  }
});

app.post("/api/verify-reset-token", (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) {
    return res.status(400).json({ verified: false, message: "Email and token required" });
  }

  const storedToken = otpStore[`reset_${email}`];
  if (storedToken && storedToken === token) {
    delete otpStore[`reset_${email}`];
    res.json({ verified: true, message: "Token verified. You can now reset your password." });
  } else {
    res.json({ verified: false, message: "Invalid or expired token" });
  }
});
app.get("/", (req, res) => {
  res.send("FixMyArea Backend Server is running.");
});

// ========== SERVER START ==========

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:3001`);
});
