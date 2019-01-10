const Division = require('../schemas/division.schema')
const Standard = require('../schemas/standard.schema')

Standard.hasMany(Division, {foreignKey: 'standard_id'})
Division.belongsTo(Standard, {foreignKey: 'standard_id'})

exports.getAll = (done) => {
    Division.findAll({
        attributes: ['id', 'division', 'standard_id'],
        include: [{model:Standard, attributes: ['standard']}]
        })
        .then((divisionData) => {
            done(null, divisionData)
        }).catch((err) => {
        done(err)
    })
}

exports.getByStandard = (id,done) => {
    Division.findAll({
        where:{
          standard_id: id
        },
        attributes: ['id', 'division'],
        include: [{model:Standard, attributes: ['standard']}]
    })
        .then((divisionData) => {
            done(null, divisionData)
        }).catch((err) => {
        done(err)
    })
}