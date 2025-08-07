const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

brandSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Brand', brandSchema);