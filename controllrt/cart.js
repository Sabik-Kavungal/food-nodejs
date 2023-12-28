// routes/cart.js
const express = require('express');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const authenticateUser = require('../mid/auth_mid');
const User = require('../models/userModel');
const cartRouter = express.Router();


cartRouter.post('/add-cart', authenticateUser, async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      // Check if the request body is valid
      if (!userId || !productId) {
        return res.status(400).json({ error: 'Invalid request body.' });
      }
  
      // Find the user's cart or create a new one if not exists
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }
  
      // Check if the product already exists in the cart
      const existingItem = cart.items.find((cartItem) =>
        cartItem.product.equals(productId)
      );
  
      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if product exists
      } else {
        // Product not in cart, fetch product details
        const product = await Product.findById(productId);
  
        if (!product) {
          return res
            .status(404)
            .json({ msg: `Product with ID ${productId} not found.` });
        }
  
        // Add the product to the cart
        cart.items.push({
          product: productId,
          quantity: 1, // You may set the default quantity as needed
          name: product.name,
          price: product.price,
        });
      }
  
      // Save the updated cart
      await cart.save();
  
      // Respond with the updated cart
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  cartRouter.delete('/remove-from-cart/:productId/:userId', authenticateUser, async (req, res) => {
    try {
      const { userId, productId } = req.params;
      
  
      // Check if the request body is valid
      if (!userId || !productId) {
        return res.status(400).json({ error: 'Invalid request body.' });
      }
  
      // Find the user's cart
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found.' });
      }
  
      // Check if the product exists in the cart
      const existingItemIndex = cart.items.findIndex((cartItem) =>
        cartItem.product.equals(productId)
      );
  
      if (existingItemIndex !== -1) {
        // Decrement the quantity
        cart.items[existingItemIndex].quantity -= 1;
  
        // If quantity is now 0, remove the item from the cart
        if (cart.items[existingItemIndex].quantity === 0) {
          cart.items.splice(existingItemIndex, 1);
        }
  
        // Save the updated cart
        await cart.save();
  
        // Respond with the updated cart
        res.json(cart);
      } else {
        return res.status(404).json({ error: 'Product not found in the cart.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  cartRouter.put('/increment-cart-item/:productId/:userId', authenticateUser, async (req, res) => {
    try {
      const { userId, productId } = req.params;
  
      // Check if the request body is valid
      if (!userId || !productId) {
        return res.status(400).json({ error: 'Invalid request body.' });
      }
  
      // Find the user's cart
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found.' });
      }
  
      // Check if the product exists in the cart
      const existingItemIndex = cart.items.findIndex((cartItem) =>
        cartItem.product.equals(productId)
      );
  
      if (existingItemIndex !== -1) {
        // Increment the quantity
        cart.items[existingItemIndex].quantity += 1;
  
        // Save the updated cart
        await cart.save();
  
        // Respond with the updated cart
        res.json(cart);
      } else {
        return res.status(404).json({ error: 'Product not found in the cart.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  cartRouter.get("/carts", authenticateUser, async (req, res) => {
    try {
      const orders = await Cart.find({ userId: req.user });
      res.json(orders);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  




  cartRouter.delete('/remove/:userId/:productId', authenticateUser, async (req, res) => {
    try {
      const userId = req.params.userId;
      const productId = req.params.productId;
  
      // Check if the user's cart exists
      const userCart = await Cart.findOne({ user: userId });
  
      if (!userCart) {
        return res.status(404).json({ msg: `Cart not found for user with ID ${userId}.` });
      }
  
      // Check if the item exists in the cart
      const itemIndex = userCart.items.findIndex(item => item.product.equals(productId));
  
      if (itemIndex === -1) {
        return res.status(404).json({ msg: `Product with ID ${productId} not found in the cart.` });
      }
  
      // Remove the item from the cart
      userCart.items.splice(itemIndex, 1);
  
      // Save the updated cart
      await userCart.save();
  
      res.json(userCart);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

module.exports = cartRouter;
