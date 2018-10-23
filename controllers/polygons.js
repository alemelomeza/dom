var config = require('../config')
var client = require('mongodb').MongoClient(config.db.uri, { useNewUrlParser: true })


module.exports = {
    all: (req, res) => {
        client.connect((error) => {
            if (error) {
                res.status(500).json({
                    response: 'Error connecto to server'
                })
            }

            var collection = client.db(config.db.name).collection('polygons')

            collection.find({}).limit(2).toArray((error, docs) => {
                if (error) {
                    res.status(404).json({
                        response: 'Document not found'
                    })
                }

                res.status(200).json({
                    response: docs
                })
            })

            client.close()
        })
    },
    create: (req, res) => {
        res.status(200).json({
            response: 'coming soon'
        })
    },
    update: (req, res) => {
        res.status(200).json({
            response: 'coming soon'
        })
    },
    destroy: (req, res) => {
        res.status(200).json({
            response: 'coming soon'
        })
    }
}
