const {Router} = require('express');
const router = Router();
const Student = require('../schemas/student.schema')
const Parent = require('../schemas/parent.schema')
const {verifyTeacher, verifyParentStudent} = require('../middleware/verify_token')
const {addNote, getMyNotes, getNotes} = require('../controllers/notes.controller')

router.post('/teacher',verifyTeacher, (req, res) => {
    const id = req.decoded._id
    req.body.teacher_id = id
    addNote(req.body, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else{
            res.statusCode = 201
            res.json({success: 1, response: result})
        }
    })
})

router.get('/teacher', verifyTeacher, (req, res) => {
    const id = req.decoded._id
    getMyNotes(id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0 ){
            res.statusCode = 200
            res.json({success: 0, error: "No notes found"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

var getDayNotes = (division_id, res) => {
    getNotes(division_id, (err, result) => {
        if(err) {
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0 ) {
            res.statusCode = 200
            res.json({success: 0, error: "No notes available"})
        }else {
            res.statusCode = 200
            res.json({success: 1, respones: result})
        }
    })
}

router.get('/student', verifyParentStudent, (req, res) => {
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
            getDayNotes(division_id, res)
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
            getDayNotes(division_id, res)
        }).catch((err) => {
            res.statusCode = 200
            res.json({success: 0, error: err})
        })
    }
})

module.exports = router;