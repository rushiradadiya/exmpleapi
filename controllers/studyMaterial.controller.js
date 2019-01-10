const StudyMaterial = require('../schemas/studyMaterial.schema')
const Media = require('../schemas/media.schema')
const {db} = require('../configs/database')

StudyMaterial.hasMany(Media, {foreignKey: 'studyMaterial_id'})
Media.belongsTo(StudyMaterial, {foreignKey: 'studyMaterial_id'})

exports.insert = (body, file, done) => {
    StudyMaterial.find({
        where: {
            subject_id: body.subject_id,
            teacher_id: body.teacher_id,
            division_id: body.division_id
        }
    }).then((data) => {
        if(data){
            var mediaData = {
                type: 'StudyMaterial',
                studyMaterial_id: data.id,
                image_url: file.filename
            }

            Media.create(mediaData)
            .then((newMedia) =>{
                done(null, "Record updated successfully")
            }).catch((err) => {
                done(err)
            })
        }else {
            var studyMaterialData = {
                subject_id: body.subject_id,
                teacher_id: body.teacher_id,
                division_id: body.division_id
            }

            StudyMaterial.create(studyMaterialData)
            .then((newData) => {
                if(newData){
                    var mediaData = {
                        type: 'StudyMaterial',
                        studyMaterial_id: newData.id,
                        image_url: file.filename
                    }

                    Media.create(mediaData)
                    .then((newMedia) =>{
                        done(null, "Record inserted successfully")
                    }).catch((err) => {
                        done(err)
                    })
                }else {
                    done("Problem inserting record")
                }
            }).catch((err) => {
                done(err)
            })
        }
    }).catch((err) => {
        done(err)
    })
}

exports.getLectures = (id, done) => {
    db.query('SELECT DISTINCT Standards.standard, Divisions.division, Divisions.id AS division_id, Subjects.subject, Subjects.id AS subject_id FROM TimeTableSchedules, Teachers, Standards, Divisions, Subjects WHERE TimeTableSchedules.teacher_id = '+ id +' and TimeTableSchedules.teacher_id = Teachers.id AND Standards.id = TimeTableSchedules.standard_id AND TimeTableSchedules.division_id = Divisions.id AND Subjects.id = TimeTableSchedules.subject_id')
    .spread((lectures) => {
        done(null, lectures)
    }).catch((err) => {
        done(err)
    })
}

exports.getMaterials = (body, done) => {
    StudyMaterial.find({
        where: {
            subject_id: body.subject_id,
            teacher_id: body.teacher_id,
            division_id: body.division_id
        },
    }).then((data) => {
        if(data){
            Media.findAll({
                where: {
                    studyMaterial_id: data.id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: ['id','image_url', 'createdAt']
            }).then((data) => {
                done(null, data)
            }).catch((err) => {
                done(err)
            })
        }else {
            done("No files uploaded")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.deleteMaterial = (id, done) => {
    Media.destroy({
        where:{
            id: id
        }
    }).then((materialDeleted) => {
        if(materialDeleted){
            done(null, "Material deleted successfully")
        }else {
            done("Problem deleting material")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.getLecturesStudent = (id, done) => {
    db.query('SELECT DISTINCT Subjects.subject, Subjects.id FROM TimeTableSchedules, Subjects, Divisions WHERE TimeTableSchedules.subject_id = Subjects.id AND TimeTableSchedules.division_id = Divisions.id AND Divisions.id = ' + id)
        .spread((lectures) => {
            done(null, lectures)
        }).catch((err) => {
        done(err)
    })
}

exports.getMaterialsStudent = (division_id, subject_id, done) => {
    var id = ''
    StudyMaterial.findAll({
        where: {
            subject_id: subject_id,
            division_id: division_id
        },
        attributes: ['id']
    }).then((ids) => {
        if(ids.length > 0){
            if(ids.length == 1){
                id = ids[0].dataValues.id
            }else if(ids.length > 1){
                for(i=0;i<ids.length - 1;i++){
                    id += ids[i].dataValues.id + ','
                }
                id += ids[ids.length - 1].dataValues.id
            }

            db.query('SELECT id, image_url, createdAt FROM Media WHERE Media.studyMaterial_id IN ('+ id +') ORDER BY createdAt DESC')
                .spread((materials) => {
                    done(null, materials)
                }).catch((err) => {
                done(err)
            })
        }else {
            done(null, ids)
        }
    }).catch((err) => {
        done(err)
    })
}

//SELECT DISTINCT Subjects.subject, Subjects.id FROM TimeTableSchedules, Subjects, Divisions WHERE TimeTableSchedules.subject_id = Subjects.id AND TimeTableSchedules.division_id = Divisions.id AND Divisions.id = 1