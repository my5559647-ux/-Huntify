import { Request, Response } from 'express';
import { sendEmail, generateProposalEmail } from '../services/emailService';

export const sendProposalEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      leadName,
      leadEmail,
      leadNiche,
      leadAddress,
      leadIssue,
      senderName,
      senderEmail,
      senderSkill,
    } = req.body;

    // Validate required fields
    if (!leadName || !leadEmail || !senderName || !senderEmail) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: leadName, leadEmail, senderName, senderEmail',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadEmail)) {
      res.status(400).json({
        success: false,
        message: 'Invalid lead email format',
      });
      return;
    }

    // Generate email content
    const { html, text } = generateProposalEmail({
      name: leadName,
      niche: leadNiche || 'Local Business',
      address: leadAddress || 'Location not specified',
      hasWebsiteIssue: leadIssue || 'Potential digital improvement opportunities identified',
      senderName,
      senderEmail,
      senderSkill: senderSkill || 'Professional Service Provider',
    });

    // Send email
    const result = await sendEmail({
      to: leadEmail,
      subject: `Business Proposal from ${senderName} - Huntify`,
      html,
      text,
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        previewUrl: result.previewUrl,
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error: any) {
    console.error('Email controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send proposal email',
    });
  }
};