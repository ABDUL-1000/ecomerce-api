const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('ownerId', 'fullName email');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { productName, cost, productImages, description, stockStatus } = req.body;
    
    const product = new Product({
      productName,
      ownerId: req.user.userId,
      cost,
      productImages,
      description,
      stockStatus,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { productName, cost, productImages, description, stockStatus } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }


    if (product.ownerId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

 
    if (productName) product.productName = productName;
    if (cost) product.cost = cost;
    if (productImages) product.productImages = productImages;
    if (description) product.description = description;
    if (stockStatus) product.stockStatus = stockStatus;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.ownerId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully',
      
     });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};