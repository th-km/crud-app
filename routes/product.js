const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Product = require('../models/product')
const Review = require('../models/review')

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

const createFilters = req => {
  const filters = {}

  if (req.query.priceMin) {
    filters.price = {}
    filters.price.$gte = req.query.priceMin
  }

  if (req.query.priceMax) {
    if (filters.price === undefined) {
      filters.price = {}
    }
    filters.price.$tle = req.query.priceMax
  }

  if (req.query.category) {
    filters.category = req.query.category
  }

  if (req.query.title) {
    filters.title = new RegExp(req.query.title, 'i')
  }

  return filters
}

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
    const filters = createFilters(req)
    const search = await Product.find(filters).populate('reviews')

    if (req.query.sort === 'rating-asc') {
      search.sort({ averageRating: 1 })
    } else if (req.query.sort === 'rating-desc') {
      search.sort({ price: 1 })
    } else if (req.query.sort === 'price-desc') {
      search.sort({ price: -1 })
    }

    if (req.query.page) {
      const page = req.query.page
      const limit = 2

      search.limit(limit)
      search.skip(limit * (page - 1))
    }

    const products = await search

    return res.json(products)
  } catch (error) {
    return res.status(400).json({ message: error.message })
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

    if (product) {
      product.title = req.body.title
      product.description = req.body.description
      product.category = req.body.category

      await product.save()
      return res.json({ message: 'Product updated' })
    } else {
      return res.status(400).json({ message: 'Product not found' })
    }
  } catch (error) {
    return res.status(400).json({ message: error.message })
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
    return res.json({ message: error.message })
  }
})

module.exports = router
