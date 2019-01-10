const {Router} = require('express');
const router = Router();
const {verifyParent, verifyAdmin, verifyParentStudent} = require('../middleware/verify_token')
const {sendComplain,getAll, getMyComplians} = require('../controllers/complain.controller')

router.post('/',verifyParent, (req, res) => {
    const id = req.decoded._id
    req.body.parent_id = id
    sendComplain(req.body, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({successs: 0, error: err})
        }else{
            res.statusCode = 201
            res.json({success: 1, response: result})
        }
    })
})

router.get('/', verifyAdmin, (req, res) => {
    getAll((err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success:0, error: "No "})
        }
    })
})

router.get('/parent', verifyParentStudent, (req, res) => {
    const id = req.decoded._id
    getMyComplians(id, (err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No communication yet"})
        }else {
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

module.exports = router;