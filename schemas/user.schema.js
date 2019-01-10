const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');

const userSchema = db.define('User', {
    id:{
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        required: true
    },
    password:{
        type:Sequelize.STRING
    },
    role: {
        type: Sequelize.ENUM('Admin', 'Teacher', 'Parent', 'Student'),
    },
    is_active:{
        type:Sequelize.INTEGER,
        defaultValue: 1
    }
});

userSchema.sync({force:false}).then((res) => {
    console.log('User Table Created Successfully');
}).catch((error) => {
    console.log(error);
})

module.exports = userSchema;