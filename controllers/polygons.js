const { db } = require('../config')
const client = require('mongodb').MongoClient(db.uri, { useNewUrlParser: true })


module.exports = {
    all: (req, res) => {
        client.connect((error) => {
            if (error) {
                res.status(500).json({
                    response: 'Error connecto to server'
                })
            }

            const collection = client.db(db.name).collection('polygons')

            collection.find({}).toArray((error, docs) => {
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
