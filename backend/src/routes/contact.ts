import { Router } from 'express';
import { submitContact } from '../controllers/contactController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all contact routes
router.use(authenticateToken);

// Submit contact message
router.post('/', submitContact);

export default router;
