const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Product = require('../models/product')
const Review = require('../models/review')

const router = express.Router()
router.use(bodyParser.json())

const calculateRating = product => {
  if (product.reviews.length === 0) {
    return 0
  }

  let rating = 0

  for (let i = 0; i < product.reviews.length; i++) {
    rating = rating + product.reviews[i].rating
  }

  rating = rating / product.reviews.length
  rating = Number(rating.toFixed(1))

  return rating
}

/*
 |--------------------------------------------------------------------------
 | CREATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/review/create
 | Parameter Body : product (id), rating, comment, username
*/

router.post('/review/create', async (req, res) => {
  try {
    const product = await Product.findById(req.body.product).populate('reviews')

    if (product) {
      if (product.reviews === undefined) {
        product.reviews = []
      }

      const review = new Review({
        rating: req.body.rating,
        comment: req.body.comment,
        username: req.body.username
      })

      await review.save()
      product.reviews.push(review)

      const rating = calculateRating(product)
      product.averageRating = rating

      await product.save()
      return res.json(review)
    } else {
      return res.status(400).json({ message: 'Product not found' })
    }
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | UPDATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/review/update
 | Parameter Query: id
 | Parameter Body: rating, comment
*/

router.post('/review/update', async (req, res) => {
  try {
    const review = await Review.findById(req.query.id)

    if (review) {
      review.rating = req.body.rating
      review.comment = req.body.comment
      await review.save()

      const product = await Product.findOne({
        reviews: { $in: [req.query.id] }
      }).populate('reviews')

      const rating = calculateRating(product)
      product.averageRating = rating

      await product.save()
      res.json(review)
    } else {
      res.status(400).json({ message: 'Review not found' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | DELETE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/review/delete
 | Parameter Query: id
 | Product.findOne({ reviews: req.query.id })
*/

router.post('/review/delete', async (req, res) => {
  try {
    const review = await Review.findById(req.query.id)

    if (review) {
      await review.remove()
      return res.json({ message: 'Review removed' })
    } else {
      return res.status(400).json({ message: 'Review not found' })
    }
  } catch (error) {
    return res.json({ message: error.message })
  }
})

module.exports = router
