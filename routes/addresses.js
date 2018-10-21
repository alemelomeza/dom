const express = require('express')
const router = express.Router()

const { get } = require('../controllers/addresses')

router.route('/:address')
    .get(get)

module.exports = router
