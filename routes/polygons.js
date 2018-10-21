const express = require('express')
const router = express.Router()

const { all, create, update, destroy } = require('../controllers/polygons')

router.route('/')
    .get(all)
    .post(create)

router.route('/:id')
    .put(update)
    .delete(destroy)

module.exports = router
