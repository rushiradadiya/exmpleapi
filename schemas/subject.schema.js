const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Standard = require('./standard.schema')

const subjectSchema =db.define('Subject',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    subject: {
        type: Sequelize.STRING,
        required: true,
    }
});

subjectSchema.sync({force:false}).then((res)=>{
    console.log("Subject table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = subjectSchema;