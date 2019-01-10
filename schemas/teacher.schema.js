const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Standard = require('./standard.schema');
const Division = require('./division.schema')
const User = require('./user.schema')

const teacherSchema =db.define('Teacher',{
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
    },
    mobile_no: {
        type: Sequelize.STRING,
        required: true
    },
    address: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        required: true
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
            fields: ['standard_id', 'division_id']
        }
    ]
});

teacherSchema.belongsTo(User, {foreignKey: 'user_id'})
teacherSchema.belongsTo(Standard, {foreignKey: 'standard_id'})
teacherSchema.belongsTo(Division, {foreignKey: 'division_id'})

teacherSchema.sync({force:false}).then((res)=>{
    console.log("Teacher table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = teacherSchema;

//teacher teacher@gmail.com
//teacher1 teacher1@gmail.com
//teacher3    teacher3@gmail.com
//teacher4    teacher4@gmail.com
//teacher5      teacher5@gmail.com

//"parent_password": "parent1" - parent1@gmail.com
//"student_password": "JLd6AmhB8B" - student1@gmail.com

//parent2@gmail.com   parent2
//student2@gmail.com   student2

//parent3@gmail.com     z891JWqG3I
//student3@gmail.com    0Y0nUIT50i

//parent4@gmail.com     lw6xeqksGW
//student4@gmail.com    C0jHQJNbaj

//parent5@gmail.com     parent5
//student5@gmail.com    student5

//parent6@gmail.com     FNZAlyDcSm
//student6@gmail.com    7xAUiaLKp0

//parent7@gmail.com     KjgTqoMKUs
//student7@gmail.com    j4Klgp8O8Z

//admin admin@gmail.com admin

//http://localhost:3000/api-docs/#/