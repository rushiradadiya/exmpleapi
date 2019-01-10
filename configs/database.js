const Sequelize = require('sequelize');

exports.url = 'mysql://root:root@localhost:3306/Buddy'

exports.db = new Sequelize('Buddy','root','root',{
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
        multipleStatements: true
    },
});