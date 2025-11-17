const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();

// CORS - Allow all origins
app.use(cors({ 
  origin: 'https://fix-my-area-seven.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "fixmyareas@gmail.com",
    pass: process.env.EMAIL_PASS || "tiepmcpbmfzocgar",
  },
});

// Verify transporter on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// ========== SEND EMAIL TO GOVERNMENT ==========
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

  // Validation
  if (!governmentEmail || !issueTitle) {
    return res.status(400).json({ 
      success: false, 
      message: "Government email and issue title are required" 
    });
  }

  console.log(`📧 Sending email to: ${governmentEmail}`);
  console.log(`📋 Issue: ${issueTitle}`);

  const mailOptions = {
    from: '"FixMyArea - Citizen Portal" <fixmyareas@gmail.com>',
    to: governmentEmail,
    subject: `🚨 Community Issue Report: ${issueTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background-color: #f5f5f5;
            padding: 20px;
          }
          .email-container { 
            max-width: 700px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); 
            padding: 40px 30px; 
            text-align: center; 
            color: white;
          }
          .logo { 
            font-size: 36px; 
            margin-bottom: 10px;
          }
          .header-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .content { 
            padding: 40px 30px; 
          }
          .alert-badge {
            display: inline-block;
            background: #ff4444;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 25px;
          }
          .issue-title {
            font-size: 26px;
            font-weight: bold;
            color: #333;
            margin-bottom: 25px;
            line-height: 1.3;
          }
          .info-section {
            background: #f8f9fa;
            border-left: 4px solid #FF6B35;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            margin-bottom: 12px;
          }
          .info-label {
            font-weight: bold;
            color: #666;
            min-width: 140px;
            font-size: 14px;
          }
          .info-value {
            color: #333;
            font-size: 14px;
            flex: 1;
          }
          .description-box {
            background: #ffffff;
            border: 2px solid #e0e0e0;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
          }
          .description-text {
            color: #555;
            line-height: 1.7;
            font-size: 15px;
          }
          .image-container {
            margin: 25px 0;
            text-align: center;
          }
          .issue-image {
            max-width: 100%;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          }
          .stats-box {
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
          }
          .stats-number {
            font-size: 48px;
            font-weight: bold;
            color: #FF6B35;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
            color: white;
            padding: 16px 40px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            margin: 25px 0;
          }
          .action-required {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
          }
          .footer { 
            background: #2c3e50; 
            padding: 30px; 
            text-align: center; 
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">🏙️</div>
            <div class="header-title">FixMyArea</div>
            <p style="font-size: 14px; opacity: 0.95;">Citizen-Government Communication Portal</p>
          </div>

          <div class="content">
            <div class="alert-badge">🚨 NEW ISSUE REPORTED</div>
            
            <div class="issue-title">${issueTitle}</div>

            <div class="info-section">
              <div class="info-row">
                <span class="info-label">📂 Category:</span>
                <span class="info-value">${issueCategory || 'General Issue'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">📍 Location:</span>
                <span class="info-value">${issueLocation || 'Location not specified'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">👤 Reported By:</span>
                <span class="info-value">${reportedBy || 'Anonymous Citizen'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">📅 Date:</span>
                <span class="info-value">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            ${upvotes ? `
              <div class="stats-box">
                <div class="stats-number">👍 ${upvotes}</div>
                <p style="margin-top: 8px; font-size: 14px; color: #666;">Community Members Support This Issue</p>
              </div>
            ` : ''}

            <div class="description-box">
              <p style="font-weight: bold; color: #FF6B35; margin-bottom: 15px;">📝 Detailed Description</p>
              <div class="description-text">${issueDescription || 'No detailed description provided.'}</div>
            </div>

            ${imageUrl ? `
              <div class="image-container">
                <p style="font-weight: bold; color: #FF6B35; margin-bottom: 15px;">📸 Visual Evidence</p>
                <img src="${imageUrl}" alt="Issue Evidence" class="issue-image" />
              </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://fix-my-area-seven.vercel.app/issue/${issueId || ''}" class="cta-button">
                🔍 View Full Issue Details
              </a>
            </div>

            <div class="action-required">
              <p style="font-weight: bold; color: #856404; margin-bottom: 10px;">⚠️ Government Action Required</p>
              <p style="color: #856404; font-size: 14px; line-height: 1.6;">
                This issue has been officially reported through FixMyArea. Please:
              </p>
              <ul style="margin: 12px 0 0 20px; line-height: 1.8; color: #856404;">
                <li>Acknowledge receipt within 48 hours</li>
                <li>Conduct site inspection</li>
                <li>Provide resolution timeline</li>
                <li>Update status regularly</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">🏛️ Official Government Communication</p>
            <p style="font-size: 13px; opacity: 0.9; margin-bottom: 20px;">
              Sent from FixMyArea citizen engagement platform
            </p>
            <p style="font-size: 11px; opacity: 0.7; margin-top: 20px;">
              © 2025 FixMyArea | Empowering Communities
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully!`);
    console.log(`📬 Message ID: ${info.messageId}`);
    
    res.json({ 
      success: true, 
      message: "Email sent to government successfully",
      messageId: info.messageId
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email", 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "✅ FixMyArea Backend Running", 
    timestamp: new Date().toISOString(),
    endpoints: {
      sendToGovernment: "POST /api/send-to-government"
    },
    version: "1.0.0"
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📧 Email service: Gmail (fixmyareas@gmail.com)`);
  console.log(`🌐 Endpoints available at http://localhost:${PORT}`);
});
