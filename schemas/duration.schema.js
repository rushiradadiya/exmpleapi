const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');

const durationSchema =db.define('Duration',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    start_time:{
        type: Sequelize.STRING,
        required: true,
    },
    end_time: {
        type: Sequelize.STRING,
        required: true
    },
    is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

durationSchema.sync({force:false}).then((res)=>{
    console.log("Duration table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = durationSchema;