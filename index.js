const express = require('express')
const mongoose = require('mongoose')

const depRoutes = require('./routes/department')
const prodRoutes = require('./routes/product')
const catRoutes = require('./routes/category')
const revRoutes = require('./routes/review')

const app = express()

app.use(depRoutes)
app.use(prodRoutes)
app.use(catRoutes)
app.use(revRoutes)

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/store', { useNewUrlParser: true })
app.listen(process.env.PORT || 3000, () => console.log('server started'))
