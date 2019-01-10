const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Subject = require('./subject.schema')
const Teacher = require('./teacher.schema')
const Duration = require('./duration.schema')
const Standard = require('./standard.schema')
const Division = require('./division.schema')

const timetableScheduleSchema =db.define('TimeTableSchedule',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    day:{
        type: Sequelize.STRING,
        required: true
    },
    subject_id: {
        type: Sequelize.INTEGER,
    },
    teacher_id: {
        type: Sequelize.INTEGER
    },
    duration_id: {
        type: Sequelize.INTEGER
    },
    standard_id: {
        type: Sequelize.INTEGER
    },
    division_id: {
        type: Sequelize.INTEGER
    }
},{
    indexes:[
        {
            unique: true,
            fields: ['day','duration_id', 'standard_id', 'division_id']
        },
        {
            unique: true,
            fields: ['teacher_id','duration_id','day']
        }
    ]
});

timetableScheduleSchema.belongsTo(Subject, {foreignKey: 'subject_id'})
timetableScheduleSchema.belongsTo(Teacher, {foreignKey: 'teacher_id'})
timetableScheduleSchema.belongsTo(Duration, {foreignKey: 'duration_id'})
timetableScheduleSchema.belongsTo(Standard, {foreignKey: 'standard_id'})
timetableScheduleSchema.belongsTo(Division, {foreignKey: 'division_id'})

timetableScheduleSchema.sync({force:false}).then((res)=>{
    console.log("TimeTableSchedule table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = timetableScheduleSchema;