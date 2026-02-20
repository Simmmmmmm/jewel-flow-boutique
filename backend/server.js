require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const { connectToDatabase } = require('./src/db');
const { orderStorage, userStorage, profileStorage, addressStorage } = require('./src/storage');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
connectToDatabase().catch(err => console.error('Database connection error:', err));

// Razorpay instance
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('Razorpay keys are not set in environment variables.');
  razorpay = null;
}

// Routes

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

const crypto = require('crypto');

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, shipping_info, subtotal, delivery_charge, total, payment_method, payment_details } = req.body;

    // Extract user_id from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user_id = decoded.userId;

    // Create Razorpay order if payment method is online
    let razorpayOrder = null;
    if (payment_method !== 'Cash on Delivery') {
      razorpayOrder = await razorpay.orders.create({
        amount: total * 100, // Amount in paisa
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
      });
    }

    // Save order to database
    const order = await orderStorage.create({
      orderId: `ORD_${Date.now()}`,
      user_id,
      items,
      shipping_info,
      subtotal,
      delivery_charge,
      total,
      payment_method,
      razorpayOrderId: razorpayOrder ? razorpayOrder.id : null
    });

    await orderStorage.save(order);

    res.json({
      success: true,
      order: order,
      razorpayOrder: razorpayOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// Verify payment
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update order status
      await orderStorage.updateOne(
        { razorpayOrderId: razorpay_order_id },
        {
          payment_status: 'paid',
          razorpayPaymentId: razorpay_payment_id,
          status: 'confirmed'
        }
      );

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Payment verification error' });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await orderStorage.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// Profile routes
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const profile = await profileStorage.findOne({ user_id: req.params.userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

app.post('/api/profile', async (req, res) => {
  try {
    const { user_id, first_name, last_name, phone, date_of_birth, avatar_url } = req.body;

    let profile = await profileStorage.findOne({ user_id });

    if (profile) {
      // Update existing profile
      await profileStorage.updateOne({ user_id }, {
        first_name,
        last_name,
        phone,
        date_of_birth,
        avatar_url
      });
      profile = await profileStorage.findOne({ user_id });
    } else {
      // Create new profile
      profile = await profileStorage.create({
        user_id,
        email: req.body.email,
        first_name,
        last_name,
        phone,
        date_of_birth,
        avatar_url
      });
      await profileStorage.save(profile);
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ success: false, message: 'Failed to save profile' });
  }
});

// Address routes
app.get('/api/addresses/:userId', async (req, res) => {
  try {
    const addresses = await addressStorage.find({ user_id: req.params.userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
  }
});

app.post('/api/addresses', async (req, res) => {
  try {
    const { user_id, type, is_default, first_name, last_name, company, address_line_1, address_line_2, city, state, postal_code, country, phone } = req.body;

    const address = await addressStorage.create({
      user_id,
      type,
      is_default,
      first_name,
      last_name,
      company,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      phone
    });

    await addressStorage.save(address);
    res.json({ success: true, address });
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ success: false, message: 'Failed to save address' });
  }
});

app.put('/api/addresses/:addressId', async (req, res) => {
  try {
    const { type, is_default, first_name, last_name, company, address_line_1, address_line_2, city, state, postal_code, country, phone } = req.body;

    const address = await addressStorage.findOne({ _id: new require('mongodb').ObjectId(req.params.addressId) });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await addressStorage.updateOne({ _id: new require('mongodb').ObjectId(req.params.addressId) }, {
      type,
      is_default,
      first_name,
      last_name,
      company,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      phone
    });

    const updatedAddress = await addressStorage.findOne({ _id: new require('mongodb').ObjectId(req.params.addressId) });
    res.json({ success: true, address: updatedAddress });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
});

app.delete('/api/addresses/:addressId', async (req, res) => {
  try {
    const address = await addressStorage.findOne({ _id: new require('mongodb').ObjectId(req.params.addressId) });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    await addressStorage.deleteOne({ _id: new require('mongodb').ObjectId(req.params.addressId) });
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
});

// User orders routes
app.get('/api/user/orders/:userId', async (req, res) => {
  try {
    const orders = await orderStorage.sort({ user_id: req.params.userId }, { order_date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await orderStorage.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    await orderStorage.deleteOne({ orderId: req.params.orderId });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
