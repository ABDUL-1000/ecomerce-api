const Brand = require('../models/Brand');
const Product = require('../models/Product');


const createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    const brand = new Brand({
      brandName
    });

    const createdBrand = await brand.save();
    res.status(201).json(createdBrand);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Brand already exists' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};


const updateBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    brand.brandName = brandName || brand.brandName;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Brand already exists' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};


const getBrands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const options = {
      page,
      limit,
      sort: { createdAt: -1 } // Sort by newest first
    };

    const brands = await Brand.paginate({}, options);
    
    res.json({
      brands: brands.docs,
      totalBrands: brands.totalDocs,
      totalPages: brands.totalPages,
      currentPage: brands.page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if any products are using this brand
    const productsWithBrand = await Product.countDocuments({ brand: req.params.id });
    if (productsWithBrand > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete brand. There are products associated with it.' 
      });
    }

    await brand.deleteOne();
    res.json({ message: 'Brand removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createBrand,
  updateBrand,
  getBrands,
  deleteBrand
};