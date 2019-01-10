const {Router} = require('express');
const router = Router();
const multer = require('multer');
const {insert, getAll, update, deleteMedia, deleteCommunity} = require('../controllers/community.controller')
const {verifyAdmin, verifyToken} = require('../middleware/verify_token')

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

router.post('/', verifyAdmin, upload.array('media'), (req, res) => {
    if(req.files){
        insert(req.body, req.files, (err, result) => {
            if(err){
                res.statusCode = 200
                res.json({success: 0, error: err})
            }else {
                res.statusCode = 200
                res.json({success: 1, response: result})
            }
        })
    }else {
        insert(req.body, [], (err, result) => {
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

router.put('/:id', verifyAdmin, upload.array('media'), (req, res) => {
    if(req.files){
        update(req.params.id, req.body, req.files, (err, result) => {
            if(err){
                res.statusCode = 200
                res.json({success: 0, error: err})
            }else {
                res.statusCode = 200
                res.json({success: 1, error: result})
            }
        })
    }else {
        update(req.body, [], (err, result) => {
            if(err){
                res.statusCode = 200
                res.json({success: 0, error: err})
            }else {
                res.statusCode = 200
                res.json({success: 1, error: result})
            }
        })
    }
})

router.get('/', verifyToken, (req, res) => {
    getAll((err, result) => {
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

router.delete('/media', verifyAdmin, (req, res) => {
    deleteMedia(req.body.ids, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

router.delete('/:id', verifyAdmin, (req, res) => {
    deleteCommunity(req.params.id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

module.exports=router;