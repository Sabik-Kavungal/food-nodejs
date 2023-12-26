// routes/order.js
const express = require('express');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const authenticateUser = require('../mid/auth_mid');

const orderRouter = express.Router();
// Place Order
// orderRouter.post('/place-order', authenticateUser, async (req, res) => {
//     try {
//       const { userId } = req.body;
  
//       // Check if the request body is valid
//       if (!userId) {
//         return res.status(400).json({ error: 'Invalid request body.' });
//       }
  
//       // Find the user's cart
//       const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price');
  
//       // Check if the cart exists
//       if (!cart || cart.items.length === 0) {
//         return res.status(400).json({ error: 'Cart is empty. Add items before placing an order.' });
//       }
  
//       // Calculate the total amount for the order
//       const totalAmount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
//       // Create an order
//       const order = new Order({
//         user: userId,
//         items: cart.items.map(item => ({ product: item.product._id,name:item.name,quantity: item.quantity })),
//         totalAmount,
//         status: 'Pending',
//       });
  
//       // Save the order to the database
//       await order.save();
  
//       // Clear the user's cart
//       await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
  
//       res.json(order);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
orderRouter.post('/place-order', authenticateUser, async (req, res) => {
    try {
      const { userId, cartId } = req.body;
  
      // Check if the request body is valid
      if (!userId || !cartId) {
        return res.status(400).json({ error: 'Invalid request body.' });
      }
  
      // Retrieve the cart associated with the user
      const cart = await Cart.findOne({ user: userId, _id: cartId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found.' });
      }
  
      // Calculate the total amount based on the items in the cart
      const totalAmount = cart.items.reduce((total, item) => {
        // Ensure item.quantity and item.price are numbers
        if (!isNaN(item.quantity) && !isNaN(item.price)) {
          return total + item.quantity * item.price;
        } else {
          console.log('Invalid quantity or price for item:', item);
          return total;
        }
      }, 0);
  
      // Create a new order
      const newOrder = new Order({
        user: userId,
        items: cart.items.map(item => ({
          product: item.product,
          quantity: item.quantity || 0,
          name: item.name,
          price: item.price,
        })),
        totalAmount: totalAmount,
        status: 'Pending',
      });
  
      // Save the order
      await newOrder.save();
  
      // Optionally, you may want to clear the cart after placing the order
      await Cart.findByIdAndDelete(cartId);
  
      res.json(newOrder);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Get all orders

orderRouter.get("/orders", authenticateUser, async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user });
      res.json(orders);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
module.exports = orderRouter;
