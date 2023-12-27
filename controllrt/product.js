// routes/product.js
const express = require('express');
const Product = require('../models/productModel');
const authenticateUser = require('../mid/auth_mid');
const admin = require('../mid/admin_mid');


const productRouter = express.Router();

productRouter.get('/products',authenticateUser, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Product
productRouter.post('/add-product',authenticateUser,admin, async (req, res) => {
    try {
      const { name, quantity,price, description } = req.body;
  
      const newProduct = new Product({
        name,
        quantity,
        price,
        description,
      });
  
      await newProduct.save();
      res.json({ msg: 'Product added successfully!', product: newProduct });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = productRouter;
