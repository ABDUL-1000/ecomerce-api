const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  productImages: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stockStatus: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order'],
    default: 'in-stock',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);