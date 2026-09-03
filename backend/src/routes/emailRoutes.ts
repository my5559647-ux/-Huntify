import { Router } from 'express';
import { sendProposalEmail } from '../controllers/emailController';

const router = Router();

/**
 * POST /api/email/send-proposal
 * Send a proposal email to a lead
 */
router.post('/send-proposal', sendProposalEmail);

export default router;