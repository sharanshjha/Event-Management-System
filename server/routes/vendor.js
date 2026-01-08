const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const RequestItem = require('../models/RequestItem');
const Order = require('../models/Order');
const { protect, vendorOnly } = require('../middleware/auth');

const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

// @route   GET /api/vendor/products
// @desc    Get vendor's products
// @access  Vendor only
router.get('/products', protect, vendorOnly, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id }).sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/vendor/products
// @desc    Add a new product
// @access  Vendor only
router.post('/products', protect, vendorOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    const product = await Product.create({
      name,
      price,
      description: description || '',
      image: req.file ? (req.file.path || req.file.secure_url || req.file.url || '') : '',
      vendorId: req.user._id,
      category: req.user.category,
      status: 'active'
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/vendor/products/:id
// @desc    Update a product
// @access  Vendor only
router.put('/products/:id', protect, vendorOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, status } = req.body;
    const product = await Product.findOne({ _id: req.params.id, vendorId: req.user._id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.status = status || product.status;
    
    if (req.file) {
      product.image = req.file.path || req.file.secure_url || req.file.url || product.image;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/vendor/products/:id
// @desc    Delete a product
// @access  Vendor only
router.delete('/products/:id', protect, vendorOnly, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, vendorId: req.user._id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vendor/product-status
// @desc    Get product status summary
// @access  Vendor only
router.get('/product-status', protect, vendorOnly, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id });
    const active = products.filter(p => p.status === 'active').length;
    const pending = products.filter(p => p.status === 'pending').length;
    const deleted = products.filter(p => p.status === 'deleted').length;

    res.json({ total: products.length, active, pending, deleted, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/vendor/request-item
// @desc    Request a new item
// @access  Vendor only
router.post('/request-item', protect, vendorOnly, async (req, res) => {
  try {
    const { itemName, description } = req.body;

    if (!itemName) {
      return res.status(400).json({ message: 'Item name is required' });
    }

    const request = await RequestItem.create({
      vendorId: req.user._id,
      itemName,
      description: description || ''
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vendor/requests
// @desc    Get vendor's item requests
// @access  Vendor only
router.get('/requests', protect, vendorOnly, async (req, res) => {
  try {
    const requests = await RequestItem.find({ vendorId: req.user._id }).sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vendor/transactions
// @desc    Get vendor's transactions (orders containing their products)
// @access  Vendor only
router.get('/transactions', protect, vendorOnly, async (req, res) => {
  try {
    const vendorProducts = await Product.find({ vendorId: req.user._id }).select('_id');
    const productIds = vendorProducts.map(p => p._id);
    
    const orders = await Order.find({
      'items.productId': { $in: productIds }
    }).populate('userId', 'name email').sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/vendor/orders/:id/status
// @desc    Update order status
// @access  Vendor only
router.patch('/orders/:id/status', protect, vendorOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
