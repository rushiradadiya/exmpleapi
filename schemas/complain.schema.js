const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Parent = require('./parent.schema')

const complainSchema =db.define('Complain',{
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
        type: Sequelize.STRING,
        required: true
    },
    parent_id: {
        type: Sequelize.INTEGER
    },
});

complainSchema.belongsTo(Parent, {foreignKey: 'parent_id'})

complainSchema.sync({force:false}).then((res)=>{
    console.log("Complain table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = complainSchema;