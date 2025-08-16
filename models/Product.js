const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
      brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
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
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);