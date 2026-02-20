import { Router } from 'express';
import { getAddresses, addAddress } from '../controllers/addressController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getAddresses);
router.post('/', addAddress);

export default router;
