const TimeTableSchedule = require('../schemas/timetable_schedule.schema')
const Student = require('../schemas/student.schema')
const {db} = require('../configs/database')
/*const Teacher = require('../schemas/teacher.schema')
const Duration = require('../schemas/duration.schema')
const Standard = require('../schemas/standard.schema')
const Subject = require('../schemas/subject.schema')
const Division = require('../schemas/division.schema')*/

/*Teacher.hasMany(TimeTableSchedule, {foreignKey: 'teacher_id'})
TimeTableSchedule.belongsTo(Teacher, {foreignKey: 'teacher_id'})

Duration.hasMany(TimeTableSchedule, {foreignKey: 'duration_id'})
TimeTableSchedule.belongsTo(Duration, {foreignKey: 'duration_id'})

Standard.hasMany(TimeTableSchedule, {foreignKey: 'standard_id'})
TimeTableSchedule.belongsTo(Standard, {foreignKey: 'standard_id'})

Subject.hasMany(TimeTableSchedule, {foreignKey: 'subject_id'})
TimeTableSchedule.belongsTo(Duration, {foreignKey: 'subject_id'})

Division.hasMany(TimeTableSchedule, {foreignKey: 'division_id'})
TimeTableSchedule.belongsTo(Division, {foreignKey: 'division_id'})*/

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var d = new Date();

exports.addLecture = (body, done) => {
    TimeTableSchedule.create(body)
        .then((schedule) => {
            if(schedule){
                done(null, schedule)
            }else{
                done("Problem adding lecture")
            }
        }).catch((err) => {
            done(err)
        })
}

exports.updateLecture = (id, body, done) => {
    TimeTableSchedule.update(body, {where: {id: id}}).then((updated) => {
        if(updated){
            done(null, "Lecture updated successfully")
        }else {
            done("Problem updating lecture")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.getLectures = (id, done) => {
    db.query('SELECT TimeTableSchedules.id, TimeTableSchedules.day, Teachers.name, Standards.standard, Divisions.division, Subjects.subject, Durations.start_time, Durations.end_time FROM TimeTableSchedules, Teachers, Standards, Divisions, Subjects, Durations WHERE TimeTableSchedules.division_id = '+id+' and TimeTableSchedules.teacher_id = Teachers.id AND TimeTableSchedules.standard_id = Standards.id AND TimeTableSchedules.division_id = Divisions.id AND TimeTableSchedules.subject_id = Subjects.id and TimeTableSchedules.duration_id = Durations.id ORDER BY TimeTableSchedules.day, Durations.start_time')
    .spread((timeTableData) => {
        done(null, timeTableData)
    }).catch((err) => {
        done(err)
    })
    /*TimeTableSchedule.findAll({
        where:{
            division_id: id
        },
        include: [{model:Teacher, attributes: ['name']}, {model:Standard, attributes: ['standard']}, {model:Division, attributes: ['division']}, {model:Subject, attributes: ['subject']},{model:Duration, attributes: ['start_time','end_time']}],
    }).then((timeTableData) => {
        done(null, timeTableData)
    }).catch((err) => {
        done(err)
    })*/
}

exports.getSchedule = (id, done) => {
    db.query('SELECT Standards.standard, Divisions.division, Subjects.subject, Durations.start_time, Durations.end_time FROM TimeTableSchedules, Teachers, Standards, Divisions, Subjects, Durations WHERE TimeTableSchedules.teacher_id = '+id+' and TimeTableSchedules.teacher_id = Teachers.id AND Standards.id = TimeTableSchedules.standard_id AND TimeTableSchedules.division_id = Divisions.id AND Subjects.id = TimeTableSchedules.subject_id and TimeTableSchedules.duration_id = Durations.id and TimeTableSchedules.day = \''+days[d.getDay()]+'\' ORDER BY TimeTableSchedules.day, Durations.start_time')
    .spread((teacherSchedule) => {
        done(null, teacherSchedule)
    }).catch((err) => {
        done(err)
    })
}

exports.getStudentSchedule = (id, done) => {
    db.query('Select TimeTableSchedules.day, Subjects.subject, Teachers.name, Durations.start_time, Durations.end_time from TimeTableSchedules, Subjects, Teachers, Durations where TimeTableSchedules.division_id = '+ id +' AND TimeTableSchedules.subject_id = Subjects.id AND TimeTableSchedules.teacher_id = Teachers.id AND TimeTableSchedules.duration_id = Durations.id ORDER BY TimeTableSchedules.day, TimeTableSchedules.duration_id')
    .spread((data) => {
        done(null, data)
    })
}

exports.deleteLecture = (id, done) => {
    TimeTableSchedule.destroy({
        where: {
            id: id
        }
    }).then((data) => {
        done(null, "Lecture deleted successfully")
    }).catch((err) => {
        done(err)
    })
}

//SELECT TimeTableSchedules.day, Teachers.name, Standards.standard, Divisions.division, Subjects.subject, Durations.start_time, Durations.end_time FROM TimeTableSchedules, Teachers, Standards, Divisions, Subjects, Durations WHERE TimeTableSchedules.division_id = 1 and TimeTableSchedules.teacher_id = Teachers.id AND Standards.id = TimeTableSchedules.standard_id AND TimeTableSchedules.division_id = Divisions.id AND Subjects.id = TimeTableSchedules.subject_id and TimeTableSchedules.duration_id = Durations.id ORDER BY Durations.start_time

//SELECT Standards.standard, Divisions.division, Subjects.subject, Durations.start_time, Durations.end_time FROM TimeTableSchedules, Teachers, Standards, Divisions, Subjects, Durations WHERE TimeTableSchedules.teacher_id = 1 and TimeTableSchedules.teacher_id = Teachers.id AND Standards.id = TimeTableSchedules.standard_id AND TimeTableSchedules.division_id = Divisions.id AND Subjects.id = TimeTableSchedules.subject_id and TimeTableSchedules.duration_id = Durations.id and TimeTableSchedules.day = 'Monday' ORDER BY Durations.start_time

//SELECT DISTINCT Standards.standard, Divisions.division, Subjects.subject, Divisions.id FROM TimeTableSchedules, Teachers, Standards, Divisions, Subjects WHERE TimeTableSchedules.teacher_id = 1 and TimeTableSchedules.teacher_id = Teachers.id AND Standards.id = TimeTableSchedules.standard_id AND TimeTableSchedules.division_id = Divisions.id AND Subjects.id = TimeTableSchedules.subject_id

//Select TimeTableSchedules.day, Subjects.subject, Teachers.name, Durations.start_time, Durations.end_time from TimeTableSchedules, Subjects, Teachers, Durations where TimeTableSchedules.division_id = 1 AND TimeTableSchedules.subject_id = Subjects.id AND TimeTableSchedules.teacher_id = Teachers.id AND TimeTableSchedules.duration_id = Durations.id ORDER BY TimeTableSchedules.day, TimeTableSchedules.duration_id