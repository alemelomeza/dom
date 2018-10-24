const morgan = require('morgan')
const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const client = require('mongodb').MongoClient(config.db.uri, { useNewUrlParser: true })
const nominatimInterface = require('nominatim-interface')
const _ = require('lodash')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

client.connect(error => {
    const collection = client.db(config.db.name).collection('polygons')

    app.get('/addresses/:address', (req, res) => {
        if (error) {
            res.status(500).json({
                response: 'error connecting to db'
            })
        }

        const query =  encodeURI(`${req.params.address}&countrycodes=cl&accept-language=es-CL&limit=1`)

        nominatimInterface(query)
            .then(data => {
                if(_.isEmpty(data)) {
                    res.status(404).json({
                        response: 'address not found'
                    })
                } else {
                    const address = _.first(data)

                    collection.findOne({ geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ parseFloat(address.lon), parseFloat(address.lat) ] } } } })
                        .then(doc => {
                            if (_.isEmpty(doc)) {
                                res.status(200).json({
                                    response: {
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [ parseFloat(address.lon), parseFloat(address.lat) ]
                                        },
                                        properties: {
                                            display_name: address.display_name
                                        }
                                    }
                                })
                            } else {
                                res.status(200).json({
                                    response: {
                                        type: 'FeatureCollection',
                                        features: [
                                            {
                                                type: 'Feature',
                                                geometry: {
                                                    type: 'Point',
                                                    coordinates: [ parseFloat(address.lon), parseFloat(address.lat) ]
                                                },
                                                properties: {
                                                    display_name: address.display_name
                                                }
                                            },
                                            {
                                                type: 'Feature',
                                                geometry: doc.geometry,
                                                properties: {}
                                            }
                                        ]
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            res.status(500).json({
                                response: 'error in db'
                            })
                        })
                }
            })
            .catch(err => {
                res.status(500).json({
                    response: 'error connecting to geocodification service ' + err
                })
            })
    })
})

app.listen(config.port, () => {
    console.log('server running...')
})
