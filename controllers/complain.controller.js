const Complain = require('../schemas/complain.schema')
const Parent = require('../schemas/parent.schema')
const {db} = require('../configs/database')

Parent.hasMany(Complain, {foreignKey: 'parent_id'})
Complain.belongsTo(Parent, {foreignKey: 'parent_id'})

exports.sendComplain = (body, done) => {
    Complain.create(body).
    then((newComplain) => {
        done(null, newComplain)
    }).catch((err) => {
        done(err)
    })
}

exports.getAll = (done) => {
    db.query('SELECT Complains.id, Complains.title, Complains.description, Parents.name, Students.name, Standards.standard, Divisions.division FROM Complains, Parents, Students, Standards, Divisions WHERE Complains.parent_id = Parents.id and Parents.id = Students.parent_id and Students.division_id = Divisions.id and Standards.id = Students.standard_id')
    .spread((complains) => {
        done(null, complains)
    }).catch((err) => {
        done(err)
    })
}

exports.getMyComplians = (id, done) => {
    Complain.findAll({
        where: {
            parent_id: id
        },
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: ['title', 'description', 'createdAt']
    }).then((data) => {
        done(null, data)
    }).catch((err) => {
        done(err)
    })
}