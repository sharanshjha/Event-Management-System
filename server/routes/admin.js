const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const RequestItem = require('../models/RequestItem');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin only
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/vendors
// @desc    Get all vendors
// @access  Admin only
router.get('/vendors', protect, adminOnly, async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Admin only
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/vendors/:id
// @desc    Delete a vendor
// @access  Admin only
router.delete('/vendors/:id', protect, adminOnly, async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    // Also delete vendor's products
    await Product.deleteMany({ vendorId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor and their products deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/vendors/:id/membership
// @desc    Update vendor membership
// @access  Admin only
router.put('/vendors/:id/membership', protect, adminOnly, async (req, res) => {
  try {
    const { duration, status } = req.body;
    const vendor = await User.findById(req.params.id);
    
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const now = new Date();
    let endDate = new Date();
    
    if (duration === '6months') {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (duration === '1year') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (duration === '2years') {
      endDate.setFullYear(endDate.getFullYear() + 2);
    }

    vendor.membershipDuration = duration;
    vendor.membershipStatus = status || 'active';
    vendor.membershipStart = now;
    vendor.membershipEnd = endDate;
    
    await vendor.save();
    res.json({ message: 'Membership updated successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Admin only
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/orders/:id
// @desc    Update order status
// @access  Admin only
router.put('/orders/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, estimatedDeliveryDate } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, estimatedDeliveryDate },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/requests
// @desc    Get all item requests
// @access  Admin only
router.get('/requests', protect, adminOnly, async (req, res) => {
  try {
    const requests = await RequestItem.find().populate('vendorId', 'name email').sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/requests/:id
// @desc    Approve/Reject item request
// @access  Admin only
router.put('/requests/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await RequestItem.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin only
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalProducts = await Product.countDocuments({ status: 'active' });
    const totalOrders = await Order.countDocuments();
    const pendingRequests = await RequestItem.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      pendingRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
