const Notes = require('../schemas/notes.schema')
const Teacher = require('../schemas/teacher.schema')
const {db} = require('../configs/database')

Teacher.hasMany(Notes, {foreignKey: 'teacher_id'})
Notes.belongsTo(Teacher, {foreignKey: 'teacher_id'})

exports.addNote = (body, done) => {
    Notes.create(body).
    then((newNote) => {
        done(null, newNote)
    }).catch((err) => {
        done(err)
    })
}

exports.getMyNotes = (id, done) => {
    Notes.findAll({
        where:{
            teacher_id: id
        },
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: ['title', 'description', 'createdAt']
    }).then((notes) => {
        done(null, notes)
    }).catch((err) => {
        done(err)
    })
}

exports.getNotes = (division_id, done) => {
    db.query('SELECT DISTINCT Teachers.id FROM Teachers, Students WHERE Students.division_id = Teachers.division_id AND Students.division_id = ' + division_id)
    .spread((teacher_id) => {
        console.log(teacher_id)
        if(teacher_id){
            db.query('SELECT Notes.id, Notes.title, Notes.description, Notes.createdAt FROM Notes WHERE Notes.teacher_id = '+ teacher_id[0].id +' ORDER BY createdAt DESC')
            .spread((notes) => {
                done(null, notes)
            }).catch((err) => {
                done(err)
            })
        }else {
            done("No teacher assigned to this class")
        }
    }).catch((err) => {
        done(err)
    })
}

//SELECT DISTINCT Teachers.id FROM Teachers, Students WHERE Students.division_id = Teachers.division_id AND Students.division_id = 2

//SELECT Notes.id, Notes.title, Notes.description, Notes.createdAt FROM Notes WHERE Notes.teacher_id = 4 AND Notes.createdAt LIKE '2018-11-28%'