const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Student = require('./student.schema')

const attendanceSchema =db.define('Attendance',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    student_id:{
        type: Sequelize.INTEGER,
    },
    present: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
});

attendanceSchema.belongsTo(Student, {foreignKey: 'student_id'})

attendanceSchema.sync({force:false}).then((res)=>{
    console.log("Attendance table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = attendanceSchema;