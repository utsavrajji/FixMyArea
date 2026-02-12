const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'https://fix-my-area-seven.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(bodyParser.json());

// Nodemailer configuration using Brevo (more reliable for cloud hosting)
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Brevo SMTP error:", error);
  } else {
    console.log("✅ Brevo SMTP is ready to send mails.");
  }
});

// SEND OTP - endpoint for registration
app.post("/api/send-otp", async (req, res) => {
  const { email, name, otp } = req.body;

  console.log("📧 OTP request received for:", email);

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required"
    });
  }

  const mailOptions = {
    from: '"FixMyArea" <fixmyareas@gmail.com>',
    to: email,
    subject: '🔐 Your FixMyArea Registration OTP',
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f0f9ff;padding:30px 0;">
        <div style="max-width:600px;background:#fff;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,0.1);margin:0 auto;padding:40px 30px;">
          <div style="text-align:center;margin-bottom:30px;">
            <div style="background:linear-gradient(135deg,#ff6b35,#f7931e);color:#fff;font-size:26px;font-weight:700;letter-spacing:1px;border-radius:12px;padding:20px;display:inline-block;">
              FixMyArea
            </div>
          </div>
          <h2 style="color:#1f2937;margin:0 0 20px 0;font-size:24px;text-align:center;">Email Verification</h2>
          <p style="color:#4b5563;font-size:16px;line-height:1.6;margin-bottom:30px;">
            Hi ${name || 'there'},<br><br>
            Thank you for registering with FixMyArea! Please use the OTP below to verify your email address and complete your registration.
          </p>
          <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);padding:25px;border-radius:12px;text-align:center;margin:30px 0;">
            <div style="color:#6b7280;font-size:14px;font-weight:600;margin-bottom:10px;">YOUR OTP CODE</div>
            <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#1e40af;font-family:monospace;">${otp}</div>
          </div>
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;border-radius:8px;margin:25px 0;">
            <p style="margin:0;color:#92400e;font-size:14px;">
              <strong>⚠️ Security Notice:</strong> This OTP is valid for 10 minutes. Never share this code with anyone.
            </p>
          </div>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin-top:30px;text-align:center;">
            If you didn't request this code, please ignore this email.
          </p>
          <div style="border-top:2px solid #e5e7eb;margin-top:30px;padding-top:20px;text-align:center;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              Sent by FixMyArea Platform<br>
              Making Communities Better Together
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    console.log("📤 Sending OTP to:", email);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent successfully:", info.messageId);
    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("❌ OTP send failed:");
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err.message,
      code: err.code
    });
  }
});


// SEND to Government - endpoint
app.post("/api/send-to-government", async (req, res) => {
  const {
    governmentEmail,
    issueTitle,
    issueDescription,
    issueCategory,
    issueLocation,
    reportedBy,
    upvotes,
    imageUrl,
    issueId
  } = req.body;

  console.log("📧 Received request:", { governmentEmail, issueTitle });

  if (!governmentEmail || !issueTitle) {
    return res.status(400).json({
      success: false,
      message: "Government email and issue title required"
    });
  }

  const mailOptions = {
    from: '"FixMyArea" <fixmyareas@gmail.com>',
    to: governmentEmail,
    subject: `🚨 Community Issue Report: ${issueTitle}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f7faff;padding:26px 0;">
        <div style="max-width:600px;background:#fff;border-radius:16px;box-shadow:0 3px 18px #e0e6eb;margin:0 auto;padding:36px 28px;">
          <div style="background:#5bc0ee;color:#fff;font-size:22px;font-weight:700;letter-spacing:2.5px;border-radius:8px 8px 0 0;padding:20px 0 14px;">
            FixMyArea
          </div>
          <h2 style="color:#333;margin:26px 0 12px 0;font-size:21px;">Verify this Community Issue</h2>
          <p style="margin-top:0;color:#4b5c6b;font-size:16px;">A user has submitted the issue below to the government via FixMyArea:</p>
          <div style="background:#eef7ff;padding:12px 20px;border-radius:7px;margin:22px 0;">
            <div style="font-weight:bold;">${issueTitle}</div>
            <div style="font-size:15px;margin:12px 0;color:#333;">${issueDescription}</div>
            <div style="font-size:13px;color:#5cb85c;"><b>Upvotes:</b> ${upvotes || 0}</div>
            <div style="font-size:13px;color:#2b6cb0;"><b>Category:</b> ${issueCategory}</div>
            <div style="font-size:13px;"><b>Location:</b> ${issueLocation || "N/A"}</div>
            <div style="font-size:13px;color:#757575;"><b>Reported By:</b> ${reportedBy || "Anonymous"}</div>
          </div>
          ${imageUrl ? `<img src="${imageUrl}" alt="Evidence" style="max-width:100%;border-radius:7px;margin:16px 0;">` : ""}
          <div style="margin: 30px 0;">
            <a href="https://fix-my-area-seven.vercel.app/issue/${issueId || ""}" style="display:inline-block;padding:13px 34px;background:#0066cc;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">View Full Details</a>
          </div>
          <div style="font-size:13px;color:#9da8b0;margin-top:18px;">Sent by FixMyArea Platform</div>
        </div>
      </div>
    `
  };

  try {
    console.log("📤 Attempting to send email to:", governmentEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    res.json({ success: true, message: "Email sent successfully to government!" });
  } catch (err) {
    console.error("❌ Email send failed:");
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);

    res.status(500).json({
      success: false,
      message: "Mail send failed",
      error: err.message,
      code: err.code
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "✅ FixMyArea Backend Running with Brevo",
    time: new Date().toISOString(),
    smtp: "Port 2525"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("🚀 Backend online at port", PORT));
