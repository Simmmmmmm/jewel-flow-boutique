import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Create a new order
router.post('/', createOrder);

// Get all orders for the authenticated user
router.get('/', getUserOrders);

// Get a specific order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

export default router;
