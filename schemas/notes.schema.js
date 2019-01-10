const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Teacher = require('./teacher.schema')

const noteSchema =db.define('Note',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type: Sequelize.STRING,
        required: true,
    },
    description: {
        type: Sequelize.STRING,
    },
    teacher_id: {
        type: Sequelize.INTEGER,
    }
});

noteSchema.belongsTo(Teacher, {foreignKey: 'teacher_id'})

noteSchema.sync({force:false}).then((res)=>{
    console.log("Note table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = noteSchema;