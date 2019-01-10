const {Router} = require('express');
const router = Router();
const Student = require('../schemas/student.schema')
const {verifyAdmin, verifyTeacher, verifyParentStudent} = require('../middleware/verify_token')
const {classList, getStudents, getAttendance} = require('../controllers/student.controller')

router.get('/classList/:division_id', verifyAdmin, (req, res) => {
    classList(req.params.division_id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No data found"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.get('/studentList', verifyTeacher, (req, res) => {
    const email = req.decoded.email
    getStudents(email, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No data found"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

var getStudentAttendance = (id, res) => {
    getAttendance(id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
}

router.get('/attendance', verifyParentStudent, (req, res) => {
    const id = req.decoded._id
    const role = req.decoded.role

    var student_id = ''

    if(role === 'Student'){
        student_id = id
        getStudentAttendance(student_id, res)
    }else if(role === 'Parent'){
        Student.find({
            where: {
                parent_id: id
            },
            attributes: ['id']
        }).then((id) => {
            student_id = id.dataValues.id
            getStudentAttendance(student_id, res)
        }).catch((err) => {
            res.statusCode = 200
            res.json({success: 0, error: err})
        })
    }
})

module.exports = router;