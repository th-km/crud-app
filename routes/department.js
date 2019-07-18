const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Department = require('../models/department')

const router = express.Router()
router.use(bodyParser.json())

/*
 |--------------------------------------------------------------------------
 | CREATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/department/create
 | Parameter Body : title
*/

router.post('/department/create', async (req, res) => {
  try {
    const department = new Department({
      title: req.body.title
    })

    await department.save()
    return res.json({ message: 'Department created' })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | READ
 |--------------------------------------------------------------------------
 | GET http://localhost:3000/department
 | Receive attributes from all departments
*/

router.get('/department', async (req, res) => {
  try {
    const departments = await Department.find()
    return res.json(departments)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | UPDATE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/department/update
 | Parameter Query: id
 | Parameter Body: title
*/

router.post('/department/update', async (req, res) => {
  try {
    const department = await Department.findById(req.query.id)

    if (department) {
      department.title = req.body.title

      await department.save()
      return res.json(department)
    } else {
      return res.status(400).json({ message: 'Department not found' })
    }
  } catch (error) {
    return res.json({ message: error.message })
  }
})

/*
 |--------------------------------------------------------------------------
 | DELETE
 |--------------------------------------------------------------------------
 | POST http://localhost:3000/department/delete
 | Parameter Query: id
 | In case we delete a Department, we need to delete the corresponding categories
*/

router.post('/department/delete', async (req, res) => {
  try {
    const department = await Department.findById(req.query.id)

    if (department) {
      await department.remove()

      return res.json({ message: 'Department deleted' })
    } else {
      return res.status(400).json({ message: 'Department not found' })
    }
  } catch (error) {
    return res.json({ message: error.message })
  }
})

module.exports = router
