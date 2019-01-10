const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Subject = require('./subject.schema')
const Teacher = require('./teacher.schema')
const Division = require('./teacher.schema')

const studyMaterialSchema =db.define('StudyMaterial',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    subject_id:{
        type: Sequelize.INTEGER,
    },
    teacher_id: {
        type: Sequelize.INTEGER,
    },
    division_id: {
        type: Sequelize.INTEGER,
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['subject_id', 'teacher_id', 'division_id']
        }
    ]
});

studyMaterialSchema.belongsTo(Teacher, {foreignKey: 'teacher_id'})
studyMaterialSchema.belongsTo(Subject, {foreignKey: 'subject_id'})
studyMaterialSchema.belongsTo(Division, {foreignKey: 'division_id'})

studyMaterialSchema.sync({force:false}).then((res)=>{
    console.log("StudyMaterial table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = studyMaterialSchema;