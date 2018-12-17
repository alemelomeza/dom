const fs = require('fs')
const config = require('./config')
const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const cors = require('cors')
const client = require('mongodb').MongoClient(config.db.uri, { useNewUrlParser: true })
const nominatimInterface = require('nominatim-interface')
const _ = require('lodash')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

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

                    // collection.findOne({ geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ parseFloat(address.lon), parseFloat(address.lat) ] } } } })
                    collection.findOne({ geometry: { $nearSphere: { $geometry: { type: "Point", coordinates: [ parseFloat(address.lon), parseFloat(address.lat) ] }, $maxDistance: 5 } } })
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
                                                properties: doc.properties
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

    app.get('/polygons/loc/:location', (req, res) => {
        if (error) {
            res.status(500).json({
                response: 'error in db'
            })
        }

        const location = req.params.location.split(',')

        collection.findOne({ geometry: { $nearSphere: { $geometry: { type: "Point", coordinates: [ parseFloat(location[0]), parseFloat(location[1]) ] }, $maxDistance: 5 } } })
            .then(doc => {
                res.status(200).json({
                    response: doc
                })
            })
            .catch(err => {
                res.status(500).json({
                    response: 'error in db'
                })
            })
    })
})

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/mibarrioprc.cl/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/mibarrioprc.cl/fullchain.pem')
}, app).listen(config.port, () => {
    console.log('server running...')
})
