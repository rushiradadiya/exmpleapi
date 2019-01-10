const {db} = require('./../configs/database.js');
const Student = require('../schemas/student.schema')
const Teacher = require('../schemas/teacher.schema')
const Attendance = require('../schemas/attendance.schema')

exports.classList = (division_id, done) => {
    db.query('SELECT Students.name as studentName, Parents.name as parentName, Parents.phone_number, Students.email studentEmail, Parents.email as parentEmail from Parents,Students, Users WHERE Students.parent_id = Parents.id and Students.division_id = '+ division_id +' and Users.id = Students.user_id and Users.is_active = 1')
        .spread((detail) =>{
            done(null, detail)
        }).catch((err) =>{
            done(err)
        })
}

exports.getStudents = (email, done) => {
    Teacher.find({
        where:{
            email: email
        },
        attributes: ['division_id']
    }).then((division_id) => {
        db.query('SELECT Students.id, Students.name from Students, Users where Students.division_id = '+ division_id.dataValues.division_id +' and Users.id = Students.user_id and Users.is_active = 1')
            .spread((studentData) => {
                done(null, studentData)
            }).catch((err) => {
            done(err)
        })
    }).catch((err) => {
        done(err)
    })
}

exports.getAttendance = (id, done) => {
    Attendance.findAll({
        where :{
            student_id: id,
            present: false
        },
        attributes: ['createdAt']
    }).then((data) => {
        done(null, data)
    }).catch((err) => {
        done(err)
    })
}

//SELECT Students.name as studentName, Parents.name as parentName, Parents.phone_number, Students.email studentEmail, Parents.email as parentEmail from Parents,Students, Users WHERE Students.parent_id = Parents.id and Students.division_id = 1 and Users.id = Students.user_id and Users.is_active = 1