const jwt = require('jsonwebtoken');
const {jwtConfig} = require('../configs/general');

const roles = {
    ADMIN : 'Admin',
    TEACHER : 'Teacher',
    PARENT: 'Parent',
    STUDENT: 'Student'
}

exports.verifyToken = (req,res,next) => {
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token,jwtConfig.secret,(err, decoded) => {
            if(err){
                res.statusCode = 400
                return res.json({error:err.message})
            }
            req.decoded = decoded;
            next();
        })
    }else{
        res.statusCode = 403
        res.json({error:"Token is required"})
    }
}

exports.verifyAdmin = (req,res,next) => {
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token,jwtConfig.secret,(err, decoded) => {
            if(err){
                res.statusCode = 400
                return res.json({error:err.message})
            }else if(decoded.role == roles.ADMIN){
                req.decoded = decoded
                next();
            }else{
                res.statusCode = 400
                res.json({error:"You do not have access to this route"})
            }
        })
    }else{
        res.statusCode = 403;
        res.json({error:"Token is required"})
    }
}

exports.verifyParent = (req,res,next) => {
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token,jwtConfig.secret,(err, decoded) => {
            if(err){
                res.statusCode = 400
                return res.json({error:err.message})
            }else if(decoded.role == roles.PARENT){
                req.decoded = decoded
                next();
            }else{
                res.statusCode = 400
                res.json({error:"You do not have access to this route"})
            }
        })
    }else{
        res.statusCode = 403;
        res.json({error:"Token is required"})
    }
}

exports.verifyParentStudent = (req,res,next) => {
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token,jwtConfig.secret,(err, decoded) => {
            if(err){
                res.statusCode = 400
                return res.json({error:err.message})
            }else if(decoded.role == roles.PARENT || decoded.role == roles.STUDENT){
                req.decoded = decoded
                next();
            }else{
                res.statusCode = 400
                res.json({error:"You do not have access to this route"})
            }
        })
    }else{
        res.statusCode = 403;
        res.json({error:"Token is required"})
    }
}

exports.verifyTeacher = (req,res,next) => {
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token,jwtConfig.secret,(err, decoded) => {
            if(err){
                res.statusCode = 400
                return res.json({error:err.message})
            }else if(decoded.role == roles.TEACHER){
                req.decoded = decoded
                next();
            }else{
                res.statusCode = 400
                res.json({error:"You do not have access to this route"})
            }
        })
    }else{
        res.statusCode = 403;
        res.json({error:"Token is required"})
    }
}