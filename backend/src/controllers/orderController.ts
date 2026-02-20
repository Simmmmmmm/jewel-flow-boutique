import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { OrderModel } from '../models/Order';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const {
      items,
      shipping_info,
      subtotal,
      delivery_charge,
      total,
      payment_method
    } = req.body;

    const order = new OrderModel({
      user_id: userId,
      items,
      shipping_info,
      subtotal,
      delivery_charge,
      total,
      status: 'pending',
      payment_method,
      payment_status: 'pending'
    });

    await order.save();

    // Convert MongoDB _id to id for frontend compatibility
    const formattedOrder = {
      id: order._id.toString(),
      items: order.items,
      shipping_info: order.shipping_info,
      subtotal: order.subtotal,
      delivery_charge: order.delivery_charge,
      total: order.total,
      status: order.status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_date: order.order_date,
      updated_at: order.updated_at
    };

    res.status(201).json({
      message: 'Order created successfully',
      order: formattedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const orders = await OrderModel.find({ user_id: userId });

    // Convert MongoDB _id to id for frontend compatibility
    const formattedOrders = orders.map(order => ({
      id: order._id.toString(),
      items: order.items,
      shipping_info: order.shipping_info,
      subtotal: order.subtotal,
      delivery_charge: order.delivery_charge,
      total: order.total,
      status: order.status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_date: order.order_date,
      updated_at: order.updated_at
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const order = await OrderModel.findOne({ _id: id, user_id: userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Convert MongoDB _id to id for frontend compatibility
    const formattedOrder = {
      id: order._id.toString(),
      items: order.items,
      shipping_info: order.shipping_info,
      subtotal: order.subtotal,
      delivery_charge: order.delivery_charge,
      total: order.total,
      status: order.status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_date: order.order_date,
      updated_at: order.updated_at
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findOne({ _id: id, user_id: userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // Convert MongoDB _id to id for frontend compatibility
    const formattedOrder = {
      id: order._id.toString(),
      items: order.items,
      shipping_info: order.shipping_info,
      subtotal: order.subtotal,
      delivery_charge: order.delivery_charge,
      total: order.total,
      status: order.status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_date: order.order_date,
      updated_at: order.updated_at
    };

    res.json({
      message: 'Order status updated successfully',
      order: formattedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
