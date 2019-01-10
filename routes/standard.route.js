const {Router} = require('express');
const router = Router();
const {verifyToken} = require('../middleware/verify_token')
const {getAll} = require('../controllers/standard.controller')

router.get('/', verifyToken, (req, res) => {
    getAll((err, result) => {
        if(err){
            res.statusCode = 200
            res.json({success: 0, error: err})
        }else if(result.length === 0){
            res.statusCode = 200
            res.json({success: 0, error: "No data found"})
        }else{
            res.statusCode = 200
            res.json({success: 1, response: result})
        }
    })
})

module.exports = router;