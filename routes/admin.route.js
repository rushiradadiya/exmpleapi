const {Router} = require('express')
const router = Router()
const {getDuration, getSubject, getTeacher} =require('../controllers/admin.controller')
const {verifyAdmin} = require('../middleware/verify_token')

router.get('/duration', verifyAdmin, (req, res) => {
    getDuration((err, result) => {
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

router.get('/subject', verifyAdmin, (req, res) => {
    getSubject((err, result) => {
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

router.get('/teacher', verifyAdmin, (req, res) => {
    getTeacher((err, result) => {
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

module.exports = router