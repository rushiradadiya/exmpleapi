const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Standard = require('./standard.schema')

const divisionSchema =db.define('Division',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    standard_id:{
        type: Sequelize.INTEGER,
        required: true
    },
    division: {
        type: Sequelize.STRING,
        required: true,
    }
},{
    indexes: [
        { fields: ['standard_id', 'division'], unique: true }
    ]
});

divisionSchema.belongsTo(Standard, {foreignKey: 'standard_id'})

divisionSchema.sync({force:false}).then((res)=>{
    console.log("Division table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = divisionSchema;