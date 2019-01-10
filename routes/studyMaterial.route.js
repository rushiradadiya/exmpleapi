const {Router} = require('express');
const router = Router();
const multer = require('multer');
const Student = require('../schemas/student.schema')
const Parent = require('../schemas/parent.schema')
const {insert, getLectures, getMaterials, deleteMaterial, getLecturesStudent, getMaterialsStudent} = require('../controllers/studyMaterial.controller')
const {verifyTeacher, verifyParentStudent} = require('../middleware/verify_token')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'media/')
    },
    filename: function (req, file, cb) {
        let extArray = file.originalname.split(".");
        let extension = extArray[extArray.length - 1];
        //console.log(file);
        cb(null, file.originalname + '-' + Date.now()+ '.' +extension)
    }
});

const upload = multer({ storage: storage })

router.post('/', verifyTeacher, upload.single('media'), (req, res) => {
    const id = req.decoded._id
    req.body.teacher_id  = id
    if(Boolean(req.file)){
        insert(req.body, req.file, (err, result) => {
            if(err){
                res.statusCode = 200
                res.json({success: 0, error: err})
            }else {
                res.statusCode = 200
                res.json({success: 1, response: result})
            }
        })
    }else {
        insert(req.body, null, (err, result) => {
            if(err){
                res.statusCode = 200
                res.json({success: 0, error: err})
            }else {
                res.statusCode = 200
                res.json({success: 1, response: result})
            }
        })
    }
})

router.get('/', verifyTeacher, (req, res) => {
    const id = req.decoded._id
    getLectures(id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No lectures scheduled yet"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.get('/teacher/materials/:subject_id/:division_id', verifyTeacher, (req, res) => {
    const id = req.decoded._id
    var search = {
        subject_id: req.params.subject_id,
        division_id: req.params.division_id,
        teacher_id: id
    }

    getMaterials(search, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No materials uploaded yet"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.delete('/media/:id', verifyTeacher, (req, res) => {
    deleteMaterial(req.params.id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

var studentLectures = (division_id, res) => {
    getLecturesStudent(division_id, (err, result) => {
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

router.get('/student/lectures', verifyParentStudent, (req, res) => {
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
            studentLectures(division_id, res)
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
            studentLectures(division_id, res)
        }).catch((err) => {
            res.statusCode = 200
            res.json({success: 0, error: err})
        })
    }
})

var studentMaterial = (division_id, subject_id, res) => {
    getMaterialsStudent(division_id, subject_id, (err, result) => {
        if(err) {
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 202
            res.json({success: 0, error: "No materials available"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
}

router.get('/student/materials/:subject_id', verifyParentStudent, (req, res) => {
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
            studentMaterial(division_id, req.params.subject_id, res)
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
            studentMaterial(division_id, req.params.subject_id, res)
        }).catch((err) => {
            res.statusCode = 200
            res.json({success: 0, error: err})
        })
    }
})

module.exports=router;