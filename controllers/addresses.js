const config = require('../config')
const client = require('mongodb').MongoClient(config.db.uri, { useNewUrlParser: true })
const nominatim = require('nominatim-interface')
const _ = require('lodash')

module.exports = {
    get: (req, res) => {
        let query = req.params.address + '&limit=1'

        nominatim(encodeURI(query))
            .then(data => {
                let address = _.first(data)

                if (_.isEmpty(data)) {
                    res.status(404).json({
                        response: 'Not found'
                    })
                } else {
                    client.connect(error => {
                        if (error) {
                            res.status(500).json({
                                response: error
                            })
                        }

                        const collection = client.db(config.db.name).collection('polygons')

                        collection.find({ geometry: { $nearSphere: { $geometry: { type: "Point", coordinates: [ parseFloat(address.lon), parseFloat(address.lat) ] }, $maxDistance: 500 } } }).toArray((error, docs)  => {
                            if (error) {
                                res.status(404).json({
                                    response: error
                                })
                            }

                            if (_.isEmpty(docs)) {
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
                                let featureCollection = {
                                    type: 'FeatureCollection',
                                    features: []
                                }

                                featureCollection.features.push({
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [ parseFloat(address.lon), parseFloat(address.lat) ]
                                    },
                                    properties: {
                                        display_name: address.display_name
                                    }
                                })

                                for (const key in docs) {
                                    featureCollection.features.push({
                                        type: 'Feature',
                                        geometry: docs[key].geometry,
                                        properties: {}
                                    })
                                }

                                res.status(200).json({
                                    response: featureCollection
                                })
                            }
                        })

                        client.close()
                    })
                }
            })
            .catch(error => {
                res.status(404).json({
                    response: error
                })
            })

    }
}
