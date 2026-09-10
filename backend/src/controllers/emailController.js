"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProposalEmail = void 0;
const emailService_1 = require("../services/emailService");
const sendProposalEmail = async (req, res) => {
    try {
        const { leadName, leadEmail, leadNiche, leadAddress, leadIssue, senderName, senderEmail, senderSkill, } = req.body;
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
        const { html, text } = (0, emailService_1.generateProposalEmail)({
            name: leadName,
            niche: leadNiche || 'Local Business',
            address: leadAddress || 'Location not specified',
            hasWebsiteIssue: leadIssue || 'Potential digital improvement opportunities identified',
            senderName,
            senderEmail,
            senderSkill: senderSkill || 'Professional Service Provider',
        });
        // Send email
        const result = await (0, emailService_1.sendEmail)({
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
        }
        else {
            res.status(500).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        console.error('Email controller error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send proposal email',
        });
    }
};
exports.sendProposalEmail = sendProposalEmail;
