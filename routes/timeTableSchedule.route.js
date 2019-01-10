const {Router} = require('express');
const router = Router();
const {addLecture, getLectures, getSchedule, getStudentSchedule, deleteLecture, updateLecture} = require('../controllers/timeTableSchedule.controller')
const Student = require('../schemas/student.schema')
const Parent = require('../schemas/parent.schema')

const {verifyAdmin, verifyTeacher, verifyParentStudent} = require('../middleware/verify_token')

router.post('/addLecture', verifyAdmin, (req, res) => {
    addLecture(req.body, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else{
            res.statusCode = 201
            res.json({success: 1, response: result})
        }
    })
})

router.get('/:division_id', verifyAdmin, (req, res) => {
    getLectures(req.params.division_id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0 ){
            res.statusCode = 200
            res.json({success: 0, error: "No schedule available yet"})
        }
        else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.get('/teacherSchedule/schedule', verifyTeacher, (req, res) => {
    const id = req.decoded._id
    getSchedule(id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0 ){
            res.statusCode = 200
            res.json({success: 0, error: "No schedule available yet"})
        }
        else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

var timeTable = (division_id, res) => {
    getStudentSchedule(division_id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0 ){
            res.statusCode = 200
            res.json({success: 0, error: "No data found"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
}

router.get('/student/timeTable/schedule', verifyParentStudent, (req, res) => {
    const role = req.decoded.role
    const id = req.decoded._id

    var division_id = ''

    if(role === 'Student'){
        Student.find({
            where:{
                id: id
            },
            attributes: ['division_id']
        }).then((division) => {
            division_id = division.dataValues.division_id
            timeTable(division_id, res)
        }).catch((err) => {
            res.statusCode = 200
            res.json({success: 0, error: err})
        })
    }else if(role === 'Parent'){
        Student.find({
            where: {
                parent_id: id
            },
            attributes: ['division_id']
        }).then((division) => {
            division_id = division.dataValues.division_id
            timeTable(division_id, res)
        }).catch((err) => {
            res.statusCode = 200
            res.json({success: 0, error: err})
        })
    }
})

router.delete('/:id', (req, res) => {
    deleteLecture(req.params.id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.put('/:id', (req, res) => {
    updateLecture(req.params.id, req.body, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

module.exports = router;