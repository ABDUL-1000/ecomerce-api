const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  createBrand,
  updateBrand,
  getBrands,
  deleteBrand
} = require('../controllers/brandController');

const router = express.Router();

router.route('/')
  .post(protect, admin, createBrand)
  .get(getBrands);

router.route('/:id')
  .put(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand);

module.exports = router;