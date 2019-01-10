const Standard = require('../schemas/standard.schema')

exports.getAll = (done) => {
    Standard.findAll()
        .then((standardData) => {
            done(null, standardData)
        }).catch((err) => {
            done(err)
        })
}