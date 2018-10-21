const { db } = require('../config')
const client = require('mongodb').MongoClient(db.uri, { useNewUrlParser: true })
const nominatim = require('nominatim-interface')
const _ = require('lodash')

module.exports = {
    get: (req, res) => {
        let query = req.params.address + '&countrycodes=cl&accept-language=es-CL&limit=1'

        nominatim(encodeURI(query))
            .then(data => {
                let address = _.first(data)

                client.connect(error => {
                    if (error) {
                        res.status(500).json({
                            response: error
                        })
                    }

                    const collection = client.db(db.name).collection('polygons')

                    collection.find({ geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ parseFloat(address.lon), parseFloat(address.lat) ] } } } }).toArray((error, doc)  => {
                        if (error) {
                            res.status(404).json({
                                response: error
                            })
                        }

                        if (_.isEmpty) {
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
                            const polygon = _.first(doc)

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
                                            geometry: {
                                                type: 'Polygon',
                                                coordinates: polygon.geometry.coordinates
                                            },
                                            properties: {}
                                        }
                                    ]
                                }
                            })
                        }

                    })

                    client.close()
                })
            })
            .catch(error => {
                res.status(404).json({
                    response: error
                })
            })

    }
}
