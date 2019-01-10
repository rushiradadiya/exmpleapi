const attendance=require('../schemas/attendance.schema');
const Teacher=require('../schemas/teacher.schema');
const {db} = require('../configs/database');
const sequelize = require('sequelize')

const date = new Date()
const todayDate = date.getFullYear()+"-"+(((date.getMonth()+1)>=10)? (date.getMonth()+1) : '0' + (date.getMonth()+1)) + "-" + (((date.getDate())>=10)? (date.getDate()) : '0' + (date.getDate()))

exports.insert = (body, done) => {
    attendance.find({
        where:{
            $and: [
                sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', todayDate),
                { student_id: body.student_id }
            ]
        }
    }).then((updateAttendence) => {
        if(updateAttendence){
            updateAttendence.updateAttributes({
                present: body.present
            }).then((updated) => {
                if(updated){
                    done(null, "Attendance updated successfully")
                }else{
                    done("Problem updating attendance")
                }
            }).catch((err) => {
                done(err)
            })
        }else {
            attendance.create(body).then((newAttendance) => {
                done(null, newAttendance)
            }).catch((err) => {
                done(err)
            })
        }
        /*if(updateAttendence){
            attendance.update(body, {
                where:{
                    user_id: body.user_id
                }
            }).then((updatedAttendence) => {
                if(updatedAttendence){
                    attendance.find({
                        where: {
                            user_id: body.user_id
                        }
                    }).then((attendenceData) => {
                        done(null, attendenceData)
                    }).catch((err) => {
                        done(err)
                    })
                }else {
                    done("Problem updating attendence")
                }
            }).catch((err) => {
                done(err)
            })
        }else {
            attendance.create(body).
            then((newAttendenceRecord) => {
                done(null, newAttendenceRecord)
            }).
            catch((err) => {
                done(err)
            })
        }*/
    })
}

exports.getTodayAttendance = (email, done) => {
    Teacher.find({
        where: {
            email: email
        },
        attributes: ['division_id']
    }).then((teacher) => {
        db.query('SELECT Attendances.present, Students.id AS student_id, Students.name FROM Attendances, Students, Users WHERE Attendances.student_id = Students.id AND Students.division_id = '+ teacher.dataValues.division_id +' AND Users.id = Students.user_id AND Users.is_active = 1 AND Attendances.createdAt LIKE \''+todayDate+'%\'')
        .spread(async (data) => {
            if(data.length === 0){
                await db.query('SELECT Students.id AS student_id, Students.name from Students, Users where Students.division_id = '+ teacher.dataValues.division_id +' and Users.id = Students.user_id and Users.is_active = 1')
                .spread((studentData) => {
                    for(i=0; i<studentData.length; i++){
                        var data = {
                            student_id: studentData[i].student_id,
                            present: 1
                        }

                        attendance.create(data)
                        .then((data) => {
                            //console.log(data)
                        }).catch((err) => {
                            done(err)
                        })
                    }
                }).catch((err) => {
                    done(err)
                })

                db.query('SELECT Attendances.present, Students.id AS student_id, Students.name FROM Attendances, Students, Users WHERE Attendances.student_id = Students.id AND Students.division_id = '+ teacher.dataValues.division_id +' AND Users.id = Students.user_id AND Users.is_active = 1 AND Attendances.createdAt LIKE \''+todayDate+'%\'')
                .spread((data) => {
                    done(null, data)
                }).
                catch((err) => {
                    done(err)
                })
            }else{
                done(null, data)
            }
        }).catch((err) => {
            done(err)
        })
    }).catch((err) => {
        done(err)
    })
}

exports.getAttendance = (email, date, done) => {
    Teacher.find({
        where: {
            email: email
        },
        attributes: ['division_id']
    }).then((teacher) => {
        db.query('SELECT Attendances.present, Students.id AS student_id, Students.name FROM Attendances, Students, Users WHERE Attendances.student_id = Students.id AND Students.division_id = '+teacher.dataValues.division_id+' AND Users.id = Students.user_id AND Users.is_active = 1 AND Attendances.createdAt LIKE \''+date+'%\'')
            .spread((data) => {
                done(null, data)
            }).catch((err) => {
            done(err)
        })
    }).catch((err) => {
        done(err)
    })
}

//SELECT Attendances.present, Students.id AS student_id, Students.name FROM Attendances, Students, Users WHERE Attendances.student_id = Students.id AND Students.division_id = 1 AND Users.id = Students.user_id AND Users.is_active = 1 AND Attendances.createdAt LIKE '2018-11-27%'