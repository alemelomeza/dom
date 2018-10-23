var express = require('express')
var router = express.Router()

var polygons = require('../controllers/polygons')

router.route('/')
    .get(polygons.all)
    .post(polygons.create)

router.route('/:id')
    .put(polygons.update)
    .delete(polygons.destroy)

module.exports = router
