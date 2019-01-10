const {Router} = require('express');
const router = Router();
const {insert,getAttendance,getTodayAttendance} = require('../controllers/attendance.controller')
const {verifyTeacher} = require('../middleware/verify_token')

router.post('/',verifyTeacher,  (req, res) => {
    insert(req.body, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.get('/', verifyTeacher, (req, res) => {
    const email = req.decoded.email
    getTodayAttendance(email, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No data available"})
        }
        else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.get('/date/:date', verifyTeacher, (req, res) => {
    const email = req.decoded.email
    getAttendance(email, req.params.date, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No data available"})
        }
        else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

module.exports=router;