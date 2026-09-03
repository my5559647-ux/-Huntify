import nodemailer from 'nodemailer';

// Email configuration types
interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Cache for Ethereal test account
let etherealAccount: any = null;

// Create transporter based on environment
const createTransporter = async () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Use Ethereal for development/testing
    // Auto-create account if credentials not provided
    if (!process.env.ETHEREAL_USER || !process.env.ETHEREAL_PASS) {
      if (!etherealAccount) {
        console.log('Creating Ethereal test account...');
        etherealAccount = await nodemailer.createTestAccount();
        console.log('Ethereal test account created:', etherealAccount.user);
      }
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: etherealAccount.user,
          pass: etherealAccount.pass,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });
  }

  // Production SMTP configuration
  const service = process.env.EMAIL_SERVICE || 'gmail';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error('Email credentials not configured for production');
    throw new Error('Email credentials not configured');
  }

  if (service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  // Custom SMTP configuration
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user, pass },
  });
};

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; message: string; previewUrl?: string }> => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Huntify <noreply@huntify.ai>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || 'Please view this email in an HTML-capable email client.',
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);

    // Return preview URL for Ethereal in development
    // nodemailer.getTestMessageUrl returns string | false | undefined — normalize to string | undefined
    const rawPreview = nodemailer.getTestMessageUrl(info as any);
    const previewUrl = typeof rawPreview === 'string' ? rawPreview : undefined;

    return {
      success: true,
      message: 'Email sent successfully',
      previewUrl,
    };
  } catch (error: any) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send email',
    };
  }
};

// Generate professional email template for business proposals
export const generateProposalEmail = (leadData: {
  name: string;
  niche: string;
  address: string;
  hasWebsiteIssue: string;
  senderName: string;
  senderEmail: string;
  senderSkill: string;
}) => {
  const {
    name,
    niche,
    address,
    hasWebsiteIssue,
    senderName,
    senderEmail,
    senderSkill,
  } = leadData;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Business Proposal from Huntify</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #0C7075;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0C7075;
        }
        .content {
          padding: 20px 0;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        .business-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .issue-highlight {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 15px 0;
        }
        .cta-button {
          display: inline-block;
          background: #0C7075;
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          font-size: 12px;
          color: #6c757d;
        }
        @media only screen and (max-width: 480px) {
          .container {
            padding: 15px;
          }
          .logo {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Huntify</div>
          <p>Client Lead & Deal Management</p>
        </div>
        
        <div class="content">
          <p class="greeting">Dear ${name},</p>
          
          <p>I hope this email finds you well. I recently discovered your business, <strong>${name}</strong>, and wanted to reach out with a proposal that could help you grow your online presence.</p>
          
          <div class="business-info">
            <p><strong>Business Details:</strong></p>
            <p>• Name: ${name}</p>
            <p>• Category: ${niche}</p>
            <p>• Location: ${address}</p>
          </div>
          
          <div class="issue-highlight">
            <p><strong>Opportunity for Improvement:</strong></p>
            <p>${hasWebsiteIssue}</p>
          </div>
          
          <p>As a professional <strong>${senderSkill}</strong>, I specialize in helping businesses like yours overcome these challenges and attract more customers online.</p>
          
          <p>I'd love to discuss how we can work together to enhance your digital presence and drive more business to your doorstep.</p>
          
          <a href="mailto:${senderEmail}" class="cta-button">Reply to Discuss</a>
          
          <p>Looking forward to hearing from you!</p>
          
          <p>
            Best regards,<br>
            <strong>${senderName}</strong><br>
            ${senderSkill}<br>
            ${senderEmail}
          </p>
        </div>
        
        <div class="footer">
          <p>This email was sent via Huntify Platform</p>
          <p>© 2026 Huntify.ai • Professional Client Management</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Dear ${name},

I hope this email finds you well. I recently discovered your business, ${name}, and wanted to reach out with a proposal that could help you grow your online presence.

Business Details:
- Name: ${name}
- Category: ${niche}
- Location: ${address}

Opportunity for Improvement:
${hasWebsiteIssue}

As a professional ${senderSkill}, I specialize in helping businesses like yours overcome these challenges and attract more customers online.

I'd love to discuss how we can work together to enhance your digital presence and drive more business to your doorstep.

Looking forward to hearing from you!

Best regards,
${senderName}
${senderSkill}
${senderEmail}

---
This email was sent via Huntify Platform
© 2026 Huntify.ai • Professional Client Management
  `;

  return { html, text };
};
