const Duration = require('../schemas/duration.schema')
const Subject = require('../schemas/subject.schema')
const Teacher = require('../schemas/teacher.schema')

exports.getDuration = (done) => {
    Duration.findAll({
        attributes: ['id', 'start_time', 'end_time']
    })
    .then((data) => {
        done(null, data)
    }).catch((err) => {
        done(err)
    })
}

exports.getSubject = (done) => {
    Subject.findAll({
        attributes: ['id', 'subject']
    })
        .then((data) => {
            done(null, data)
        }).catch((err) => {
        done(err)
    })
}

exports.getTeacher = (done) => {
    Teacher.findAll({
        attributes: ['id', 'name']
    })
        .then((data) => {
            done(null, data)
        }).catch((err) => {
        done(err)
    })
}