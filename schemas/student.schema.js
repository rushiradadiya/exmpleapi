const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const User = require('./user.schema')
const Standard = require('./standard.schema')
const Division = require('./division.schema')
const Parent = require('./parent.schema')

const studentSchema =db.define('Student',{
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
    email: {
        type: Sequelize.STRING,
        unique: true,
        required: true
    },
    standard_id: {
        type: Sequelize.INTEGER,
    },
    division_id:{
        type: Sequelize.INTEGER
    },
    parent_id: {
        type: Sequelize.INTEGER
    }
});

studentSchema.belongsTo(User, {foreignKey: 'user_id'})
studentSchema.belongsTo(Standard, {foreignKey: 'standard_id'})
studentSchema.belongsTo(Division, {foreignKey: 'division_id'})
studentSchema.belongsTo(Parent, {foreignKey: 'parent_id'})

studentSchema.sync({force:false}).then((res)=>{
    console.log("Student table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = studentSchema;