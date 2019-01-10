const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');

const communitySchema =db.define('Community',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type: Sequelize.STRING,
        required: true
    },
    description: {
        type: Sequelize.TEXT,
        required: true,
    }
});


communitySchema.sync({force:false}).then((res)=>{
    console.log("Community table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = communitySchema;