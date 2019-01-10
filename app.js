const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path=require('path');

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger/swagger.json');

const userRoute = require('./routes/user.route')
const studentRoute = require('./routes/student.route')
const timeTableScheduleRoute = require('./routes/timeTableSchedule.route')
const standardRoute = require('./routes/standard.route')
const divisionRoute = require('./routes/division.route')
const complainRoute = require('./routes/complain.route')
const notesRoute = require('./routes/notes.route')
const attendanceRoute = require('./routes/attendance.route')
const communityRoute = require('./routes/community.route')
const studyMaterialRoute = require('./routes/studyMaterial.route')
const adminRoute = require('./routes/admin.route')

const {db} = require('./configs/database')

let app = express();
app.use(cors());

db.authenticate()
    .then(() => {
        console.log('Connection to database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/user', userRoute);
app.use('/student', studentRoute);
app.use('/timeTable', timeTableScheduleRoute);
app.use('/standard', standardRoute);
app.use('/division', divisionRoute);
app.use('/complain', complainRoute);
app.use('/notes', notesRoute);
app.use('/attendance', attendanceRoute);
app.use('/community', communityRoute);
app.use('/studyMaterial', studyMaterialRoute);
app.use('/admin', adminRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        detail: err
    });
});

app.use(express.static(path.join(__dirname,'media')));
app.listen(3000, (err, res) => {
    if(err){
        console.log("Error occurred "+err.toString());
    } else {
        console.log("Server is listening on port 3000")
    }
})