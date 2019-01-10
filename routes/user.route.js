const {Router} = require('express');
const moment = require( 'moment' );
const router = Router();
const {insertTeacher,
    userLogin,
    insertParentStudent,
    assignTeacher,
    changePassword,
    deleteUser,
    updateUser,
    getTeachers,
    classList,
    unassignTeacher,
    forgotPassword,
    resetPassword
} = require('../controllers/user.controller')
const jwt = require('jsonwebtoken');
const {jwtConfig} = require('../configs/general')
const {verifyAdmin, verifyToken} = require('../middleware/verify_token')

router.post('/teacher',(req, res) => {
    insertTeacher(req.body, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success:0, error:err})
        }else{
            res.statusCode = 201
            res.json({success: 1, response:result})
        }
    })
})

router.post('/parentStudent', (req, res) => {
    insertParentStudent(req.body, (err, result) => {
        if(err) {
            res.statusCode = 200
            res.json({success:0, error: err})
        }else {
            res.statusCode = 201,
                res.json({success: 1, response: result})
        }
    })
})

router.post('/userLogin', (req, res) => {
    userLogin(req.body, (err, result) => {
        if(err) {
            res.statusCode = 200
            res.json({success:0, error:err})
        }else if(!result){
            res.statusCode = 200
            res.json({success: 0, error: 'Invalid password'})
        }else {
            res.statusCode = 200

            const JWTToken = jwt.sign({
                    email: result.email,
                    _id: result.id,
                    user_id: result.user_id,
                    role:result.role
                },
                jwtConfig.secret
                );

            delete result.id;
            delete result.user_id;
            //delete result.role;

            res.json({success: 1, response: result, token: JWTToken})
        }
    })
})

router.post('/assignTeacher', verifyAdmin, (req, res) => {
    assignTeacher(req.body, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.put('/changePassword', verifyToken, (req, res) => {
    const id = req.decoded.user_id
    changePassword(id, req.body.oldPassword, req.body.password, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.delete('/deleteUser', verifyAdmin,(req, res) => {
    deleteUser(req.body.student_email, req.body.parent_email, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.post('/updateStudent', verifyAdmin, (req, res) => {
    updateUser(req.body, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.get('/teacher', verifyAdmin, (req, res) => {
    getTeachers((err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No teachers available"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.get('/class/classList', verifyAdmin, (req, res) => {
    classList((err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No data available"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.delete('/unassignTeacher/:teacher_id', verifyAdmin, (req, res) => {
    unassignTeacher(req.params.teacher_id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.get('/forgotPassword/:email', (req, res) => {
    forgotPassword(req.params.email, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            console.log(result)
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.put('/resetPassword', (req, res) => {
    resetPassword(req.body.email, req.body.password, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            console.log(result)
            res.json({success: 1, response: result})
        }
    })
})

/*var timeDurationOfDates = (startDate,endDate) => {
    var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
    var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
    var duration = moment.duration(start_date.diff(end_date));
    return duration;
}

router.post('/test', (req, res) => {
    const startDate = new Date().toISOString();
    const endDate = "2018-12-05T06:50:37.221Z";
    const duration = timeDurationOfDates(startDate,endDate)
    var minutes = duration.minutes();

    if(minutes <= 5){
        res.json({message: "OTP verified"})
    }else{
        res.json({message: "OTP time out"})
    }
})*/

/*router.post('/admin',(req,res) => {
    createAdmin((err, result) => {
        res.json({result})
    })
})*/

module.exports = router;

//Select Standards.standard, Divisions.division, Teachers.name FROM Standards, Divisions, Teachers WHERE Standards.id = Teachers.standard_id and Divisions.id = Teachers.division_id

//SELECT COUNT(Students.id), Divisions.division, Standards.standard FROM Students, Divisions, Standards where Standards.id = Students.standard_id and Divisions.id = Students.division_id GROUP BY Students.division_id

//SELECT COUNT(Students.id), Divisions.division, Standards.standard, Teachers.name FROM Students, Divisions, Standards, Teachers where Standards.id = Students.standard_id and Divisions.id = Students.division_id AND Teachers.standard_id = Standards.id AND Teachers.division_id = Divisions.id GROUP BY Students.division_id