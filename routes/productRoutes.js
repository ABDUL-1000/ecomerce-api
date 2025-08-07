const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { getProducts, createProduct, deleteProduct, updateProduct, getProductsByBrand } = require('../controllers/productController');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .delete(protect, admin, deleteProduct) 
  .put(protect, admin, updateProduct);  

router.route('/:brand/:page/:limit')
  .get(getProductsByBrand);

module.exports = router;