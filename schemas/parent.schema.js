const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const User = require('./user.schema')

const parentSchema =db.define('Parent',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type: Sequelize.BIGINT,
    },
    name: {
        type: Sequelize.STRING,
        required: true,
    },
    phone_number: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        required: true
    },
});

parentSchema.belongsTo(User, {foreignKey: 'user_id'})

parentSchema.sync({force:false}).then((res)=>{
    console.log("Parent table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = parentSchema;