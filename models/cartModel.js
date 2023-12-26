// models/cart.js
const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
 
      name: {
        type: String,
        required: false,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: false,
      },
    }],
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  
  module.exports = Cart;
  