const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Category = require('../models/category')

const router = express.Router()
router.use(bodyParser.json())

/*
 |--------------------------------------------------------------------------
 | CREATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/category/create
 | Parameters Body: title, description, department
*/

router.post('/category/create', async (req, res) => {
  try {
    const category = new Category({
      title: req.body.title,
      description: req.body.description,
      department: req.body.department
    })

    await category.save()
    return res.json({ message: 'Category created' })
  } catch (error) {
    return res.json(error.message)
  }
})

/*
 |--------------------------------------------------------------------------
 | READ
 |--------------------------------------------------------------------------
 | GET http://localhost:3000/category
 | Receive attributes from all CATEGORIES
*/

router.get('/category', async (req, res) => {
  try {
    const categories = await Category.find().populate('department')
    return res.json(categories)
  } catch (error) {
    return res.status(400).json(error.message)
  }
})

/*
 |--------------------------------------------------------------------------
 | UPDATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/category/update
 | Parameter Query: id
 | Parameter Body: title, description, department
*/

router.post('/category/update', async (req, res) => {
  try {
    const category = await Category.findById(req.query.id)
    category.title = req.body.title
    category.description = req.body.description
    category.department = req.body.department

    await category.save()
    return res.json({ message: 'Category updated' })
  } catch (error) {
    return res.json(error.message)
  }
})

/*
 |--------------------------------------------------------------------------
 | DELETE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/category/delete
 | Parameter Query: id
 | In case we delete a Category, we need to delete the corresponding categories
*/

router.post('/category/delete', async (req, res) => {
  try {
    const category = await Category.findById(req.query.id)

    if (category) {
      await category.remove()
      return res.json({ message: 'Category removed' })
    } else {
      return res.status(400).json({ message: 'Category not found' })
    }
  } catch (error) {
    return res.json(error.message)
  }
})

module.exports = router
