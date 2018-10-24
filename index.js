var morgan = require('morgan')

var express = require('express')
var bodyParser = require('body-parser')

var config = require('./config')

var app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/addresses', require('./routes/addresses'))

app.listen(config.port, () => {
    console.log('server running...')
})
