import { Router } from 'express';
import { startScrapingTask } from '../controllers/leadController';

const router = Router();

router.post('/start-scraping', startScrapingTask);

export default router;