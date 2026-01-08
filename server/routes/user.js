const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, userOnly } = require('../middleware/auth');

// @route   GET /api/user/products
// @desc    Get all active products
// @access  Public/User
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' })
      .populate('vendorId', 'name')
      .sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/user/products/:id
// @desc    Get single product
// @access  Public
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendorId', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/user/vendors
// @desc    Get all vendors with active products
// @access  Public
router.get('/vendors', async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' }).populate('vendorId', 'name email');
    const vendorMap = new Map();
    
    products.forEach(product => {
      if (product.vendorId && !vendorMap.has(product.vendorId._id.toString())) {
        vendorMap.set(product.vendorId._id.toString(), {
          _id: product.vendorId._id,
          name: product.vendorId.name,
          email: product.vendorId.email
        });
      }
    });

    res.json(Array.from(vendorMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/user/orders
// @desc    Place an order
// @access  User only
// GET vendors by category
router.get('/vendors/:category', protect, userOnly, async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', category: req.params.category })
      .select('name email');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET products by vendor
router.get('/vendor-products/:vendorId', protect, userOnly, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.params.vendorId, status: 'active' });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/orders', protect, userOnly, async (req, res) => {
  try {
    const { items, paymentMethod, guestName, guestEmail, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const quantity = item.quantity || 1;
        totalAmount += product.price * quantity;
        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity
        });
      }
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      guestName,
      guestEmail,
      shippingAddress,
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/user/orders
// @desc    Get user's orders
// @access  User only
router.get('/orders', protect, userOnly, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/user/orders/:id
// @desc    Get single order
// @access  User only
router.get('/orders/:id', protect, userOnly, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/user/orders/:id
// @desc    Update order status (cancel only for user)
// @access  User only
router.put('/orders/:id', protect, userOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Users can only cancel pending orders
    if (status === 'cancelled' && order.status === 'pending') {
      order.status = 'cancelled';
      await order.save();
      res.json(order);
    } else {
      res.status(400).json({ message: 'Cannot update order status' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/user/orders/:id
// @desc    Delete an order (only if pending)
// @access  User only
router.delete('/orders/:id', protect, userOnly, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending' && order.status !== 'cancelled') {
      return res.status(400).json({ message: 'Can only delete pending or cancelled orders' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/user/addresses
// @desc    Get user's addresses
// @access  User only
router.get('/addresses', protect, userOnly, async (req, res) => {
  try {
    const user = await req.user.constructor.findById(req.user._id);
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/user/addresses
// @desc    Add a new address
// @access  User only
router.post('/addresses', protect, userOnly, async (req, res) => {
  try {
    const user = await req.user.constructor.findById(req.user._id);
    const newAddress = req.body;
    
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/user/addresses/:id
// @desc    Delete an address
// @access  User only
router.delete('/addresses/:id', protect, userOnly, async (req, res) => {
  try {
    const user = await req.user.constructor.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
