const express = require('express')
const router = express.Router()

const addresses = require('../controllers/addresses')

router.route('/:address')
    .get(addresses.get)

module.exports = router
