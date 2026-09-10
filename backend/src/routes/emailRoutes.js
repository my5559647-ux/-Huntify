"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailController_1 = require("../controllers/emailController");
const router = (0, express_1.Router)();
/**
 * POST /api/email/send-proposal
 * Send a proposal email to a lead
 */
router.post('/send-proposal', emailController_1.sendProposalEmail);
exports.default = router;
