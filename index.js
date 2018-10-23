const morgan = require('morgan')

const express = require('express')
const bodyParser = require('body-parser')

const config = require('./config')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/polygons', require('./routes/polygons'))
app.use('/addresses', require('./routes/addresses'))

app.listen(config.port, () => {
    console.log('server running...')
})
