// models/product.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    required: true,
    type: Number,
  },
  description: {
    type: String,
    trim: true,
  },

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
