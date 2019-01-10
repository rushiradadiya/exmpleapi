const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');

const standardSchema =db.define('Standard',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    standard:{
        type: Sequelize.STRING,
        required: true,
        unique: true
    },
});

standardSchema.sync({force:false}).then((res)=>{
    console.log("Standard table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = standardSchema;