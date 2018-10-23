var express = require('express')
var router = express.Router()

var addresses = require('../controllers/addresses')

router.route('/:address')
    .get(addresses.get)

module.exports = router
