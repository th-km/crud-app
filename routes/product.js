const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Product = require('../models/product')

const router = express.Router()
router.use(bodyParser.json())

/*
 |--------------------------------------------------------------------------
 | CREATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/product/create
 | Parameter Body : title, description, price, category (id)
*/

router.post('/product/create', async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category
    })

    await product.save()
    return res.json({ message: 'Product created' })
  } catch (error) {
    return res.json(error.message)
  }
})

/*
 |--------------------------------------------------------------------------
 | READ
 |--------------------------------------------------------------------------
 | GET http://localhost:3000/product
 | Receive attributes from all products
 | Parameter Query: category, title, priceMin, priceMax, sort
*/

router.get('/product', async (req, res) => {
  try {
    let filter = {}

    if (req.query.category) {
      filter.category = req.query.category
    } else if (req.query.title) {
      filter.title = new RegExp(req.query.title, 'i')
    } else if (Number(req.query.priceMin)) {
      filter.price = { $gte: req.query.priceMin }
    } else if (Number(req.query.priceMax)) {
      filter.price = { $lte: req.query.priceMax }
    }

    const products = await Product.find().populate('category')

    return res.json(products)
  } catch (error) {
    return res.status(400).json(error.message)
  }
})

/*
 |--------------------------------------------------------------------------
 | UPDATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/product/update
 | Parameter Query: id
 | Parameter Body: title, description, price, category
*/

router.post('/product/update', async (req, res) => {
  try {
    const product = await Product.findById(req.query.id)
    product.title = req.body.title
    product.description = req.body.description
    product.category = req.body.category

    await product.save()
    return res.json({ message: 'Product updated' })
  } catch (error) {
    return res.json(error.message)
  }
})

/*
 |--------------------------------------------------------------------------
 | DELETE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/product/delete
 | Parameter Query: id
 | In case we delete a Department, we need to delete the corresponding categories
*/

router.post('/product/delete', async (req, res) => {
  try {
    const product = await Product.findById(req.query.id)

    if (product) {
      await product.remove()
      return res.json({ message: 'Product removed' })
    } else {
      return res.status(400).json({ message: 'Product not found' })
    }
  } catch (error) {
    return res.json(error.message)
  }
})

module.exports = router
