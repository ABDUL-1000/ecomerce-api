const Product = require('../models/Product');
const Brand = require('../models/Brand'); // Add Brand model import
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

const getProducts = async (req, res) => {
  try {
    // Check if pagination parameters exist
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const options = {
      page,
      limit,
      populate: [
        { path: 'ownerId', select: 'fullName email' },
        { path: 'brand', select: 'brandName' }
      ],
      sort: { createdAt: -1 } // Newest first
    };

    const result = await Product.paginate({}, options);
    
    res.json({
      products: result.docs,
      totalProducts: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { 
      productName, 
      brand, 
      cost, 
      productImages, 
      description, 
      stockStatus 
    } = req.body;
    console.log(req.user.userId);

    // Validate brand ID
    if (!mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).json({ message: 'Invalid brand ID format' });
    }

    // Check if brand exists
    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(404).json({ message: 'Brand not found' });
    };
   
    const product = new Product({
      productName,
      brand, 
      ownerId: req.user.userId,
      cost,
      productImages,
      description,
      stockStatus,
    });

    const createdProduct = await product.save();
    
    // Populate brand in response
    const populatedProduct = await Product.findById(createdProduct._id)
      .populate('brand', 'brandName')
      .populate('ownerId', 'fullName email');

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(val => val.message) 
      });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { 
      productName, 
      brand, // Add brand to destructuring
      cost, 
      productImages, 
      description, 
      stockStatus 
    } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.ownerId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    // Validate brand if being updated
    if (brand) {
      if (!mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({ message: 'Invalid brand ID format' });
      }
      const brandExists = await Brand.findById(brand);
      if (!brandExists) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      product.brand = brand;
    }

    if (productName) product.productName = productName;
    if (cost) product.cost = cost;
    if (productImages) product.productImages = productImages;
    if (description) product.description = description;
    if (stockStatus) product.stockStatus = stockStatus;

    const updatedProduct = await product.save();
    
    // Populate brand in response
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('brand', 'brandName')
      .populate('ownerId', 'fullName email');

    res.json(populatedProduct);
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
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductsByBrand = async (req, res) => {
  try {
    const { brand, page, limit } = req.params;
    
    // Validate brand ID
    if (!mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).json({ message: 'Invalid brand ID format' });
    }

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      populate: [
        { path: 'ownerId', select: 'fullName email' },
        { path: 'brand', select: 'brandName' }
      ]
    };

    const result = await Product.paginate(
      { brand: new mongoose.Types.ObjectId(brand) }, 
      options
    );
    
    res.json({
      products: result.docs,
      totalProducts: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  getProducts,
  getProductsByBrand, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};