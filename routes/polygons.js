const express = require('express')
const router = express.Router()

const polygons = require('../controllers/polygons')

router.route('/')
    .get(polygons.all)
    .post(polygons.create)

router.route('/:id')
    .put(polygons.update)
    .delete(polygons.destroy)

module.exports = router
