const User = require('../schemas/user.schema')
const Teacher = require('../schemas/teacher.schema')
const Student = require('../schemas/student.schema')
const Parent = require('../schemas/parent.schema')
const {db} = require('../configs/database')
const {transporter, userEmailInfo} = require('../configs/general')

var bcrypt = require('bcrypt');
var generator = require('generate-password');
var otpGenerator = require('otp-generator');

var randomPassword, parentPassword, studentPassword = ''

var validPassword = (password,hash) => {
    return bcrypt.compare(password, hash);
}

var generateHash = (password) => {
    return bcrypt.hash(password, 10);
}

var generateRandomPassword = async () => {
    randomPassword = generator.generate({
        length: 10,
        numbers: true
    });

    var password = await generateHash(randomPassword)

    return password
}

exports.insertTeacher = (body, done) => {
    User.find({
        where: {
            email: body.email
        }
    }).then( async (userExist) => {
        if(userExist){
            done("This email is already registered")
        }else {
            var userData = {
                email: body.email,
                password: await generateRandomPassword(),
                role: 'Teacher'
            }

            User.create(userData)
                .then((newUser) => {
                    var teacher = {
                        user_id: newUser.id,
                        name: body.name,
                        mobile_no: body.mobile_no,
                        address: body.address,
                        email: body.email
                    }

                    if(newUser){
                        Teacher.create(teacher)
                            .then((teacher) => {
                                if(teacher){
                                    var mailOptions = {
                                        from: userEmailInfo.emailInfo,
                                        to: body.email,
                                        subject: 'Initial password',
                                        text: 'Please use this password to login \n'+randomPassword
                                    };
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            done(error)
                                        } else {
                                            console.log('Email sent (Teacher): ===========\n' + info.response);
                                            done(null, "Teacher created successfully ");
                                        }
                                    });
                                    //done(null, randomPassword)
                                }else{
                                    done({error: "Problem", detail: "Problem inserting data"})
                                }
                            }).catch((err) => {
                            done({error: err.message, detail: err})
                        })
                    }else{
                        done({error: "Problem", detail: "Problem inserting data"})
                    }

                }).catch((err) => {
                done({error: err.message, detail: err})
                })
        }
    }).catch((err) => {
        done({error: err.message, detail: err})
    })
}

exports.insertParentStudent = (body, done) => {
    User.find({
        where: {
            $or: [
                {
                    email: {
                        $eq: body.parent_email
                    }
                },
                {
                    email:{
                        $eq: body.student_email
                    }
                }
            ]
        }
    }).then( async (userExist) => {
        if(userExist){
            done("This parent or student email is already registered")
        }else{
            var userData = {
                email: body.parent_email,
                password: await generateRandomPassword(),
                role: 'Parent'
            }

            User.create(userData)
                .then((newUser) => {
                    var parent = {
                        user_id: newUser.id,
                        name: body.parent_name,
                        phone_number: body.phone_number,
                        email: body.parent_email
                    }

                    if(newUser){
                        parentPassword = randomPassword
                        Parent.create(parent)
                            .then(async (newParent) => {
                                if(newParent){
                                    var userStudent = {
                                        email: body.student_email,
                                        password: await generateRandomPassword(),
                                        role: 'Student'
                                    }

                                    var mailOptions = {
                                        from: userEmailInfo.emailInfo,
                                        to: body.parent_email,
                                        subject: 'Initial password',
                                        text: 'Please use this password to login \n'+parentPassword
                                    };
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            done(error)
                                        } else {
                                            console.log('Email sent (Parent): ===========\n' + info.response);
                                            //done(null, "Teacher created successfully ");
                                        }
                                    });

                                    User.create(userStudent)
                                        .then((newUser1) => {
                                            var student = {
                                                user_id: newUser1.id,
                                                name: body.student_name,
                                                email: body.student_email,
                                                standard_id: body.standard_id,
                                                division_id: body.division_id,
                                                parent_id: newParent.id
                                            }

                                            if(userStudent){
                                                studentPassword = randomPassword
                                                Student.create(student)
                                                    .then((newStudent) => {
                                                        if(newStudent){
                                                            var passwords = {
                                                                parent_password: parentPassword,
                                                                student_password: studentPassword
                                                            }

                                                            var mailOptions = {
                                                                from: userEmailInfo.emailInfo,
                                                                to: body.student_email,
                                                                subject: 'Initial password',
                                                                text: 'Please use this password to login \n'+studentPassword
                                                            };
                                                            transporter.sendMail(mailOptions, function (error, info) {
                                                                if (error) {
                                                                    done(error)
                                                                } else {
                                                                    console.log('Email sent (Student): ===========\n' + info.response);
                                                                    //done(null, "Teacher created successfully ");
                                                                    done(null, "Parent and student created successfully")
                                                                }
                                                            });

                                                            //done(null, passwords)
                                                        }else{
                                                            done({error: "Problem", detail: "Problem inserting data"})
                                                        }
                                                    }).catch((err) => {
                                                        done(err)
                                                    })
                                            }else {
                                                done({error: "Problem", detail: "Problem inserting data"})
                                            }

                                        }).catch((err) => {
                                            done(err)
                                        })
                                    //done(null, randomPassword)
                                }else{
                                    done({error: "Problem", detail: "Problem inserting data"})
                                }
                            }).catch((err) => {
                                done(err)
                            })
                    }else{
                        done({error: "Problem", detail: "Problem inserting data"})
                    }
                }).catch((err) => {
                    done(err)
                })
        }
    }).catch((err) => {
        done(err)
    })
}

exports.userLogin = (body, done) => {
    User.find({
        where: {
            email: body.email,
            is_active: 1
        }
    }).then(async (user) => {
        if(!user){
            done("No user available with this email")
        }else if(!await validPassword(body.password, user.password)){
            done(null, false)
        }else{
            if(user.role === 'Teacher'){
                Teacher.find({
                    where: {
                        user_id: user.id
                    }
                }).then((teacher) => {
                    if(teacher){
                        var data = {
                            user_id: user.id,
                            id: teacher.id,
                            name: teacher.name,
                            email: user.email,
                            mobile_no: teacher.mobile_no,
                            address: teacher.address,
                            standard_id: teacher.standard_id,
                            division_id: teacher.division_id,
                            role: user.role
                        }
                        done(null, data)
                    }
                }).catch((err) => done(err))
            }else if(user.role === 'Parent'){
                Parent.find({
                    where:{
                        user_id:user.id
                    }
                }).then((parent) => {
                    if(parent){
                        var data = {
                            user_id: user.id,
                            id: parent.id,
                            name: parent.name,
                            email: user.email,
                            phone_number: parent.phone_number,
                            role: user.role
                        }
                        done(null, data)
                    }
                }).catch((err) => done(err))
            }else if(user.role === 'Student'){
                Student.find({
                    where:{
                        user_id:user.id
                    }
                }).then((student) => {
                    if(student){

                        var data = {
                            user_id: user.id,
                            id: student.id,
                            name: student.name,
                            email: user.email,
                            role: user.role,
                            division_id: student.division_id,
                            standard_id: student.standard_id
                        }
                        done(null, data)
                    }
                }).catch((err) => done(err))
            }else if(user.role === 'Admin'){
                var data =  {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }

                done(null, data)
            }
        }
    }).catch((err) => {
        done(err)
    })
}

exports.assignTeacher = (body, done) => {
    Teacher.find({
        where:{
            id: body.teacher_id
        }
    }).then((teacher) => {
        if(teacher){
            if(teacher.standard_id === null && teacher.division_id === null){
                teacher.updateAttributes({
                    standard_id: body.standard_id,
                    division_id: body.division_id
               }).then((updateTeacher) => {
                   if(updateTeacher){
                        done(null, "Teacher assigned successfully")
                   }else{
                       done("Problem updating teacher")
                   }
                }).catch((err) => {
                    done(err)
                })
            }else{
                done("Teacher is already assigned to a class")
            }
        }else{
            done("No teacher available")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.changePassword = (id, oldPassword, password, done) => {
    User.find({
        where: {
            id: id
        }
    }).then(async (user) => {
        if(user){
            if(!await validPassword(oldPassword, user.password)){
                done("Invalid old password")
            }else {
                user.updateAttributes({
                    password: await generateHash(password)
                }).then((updated) => {
                    if(updated){
                        done(null, "Password updated successfully")
                    }else{
                        done("Problem updating password")
                    }
                }).catch((err) => {
                    done(err)
                })
            }

        }else{
            done("No user available with this id")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.deleteUser = (student_email, parent_email, done) => {
    db.query('UPDATE Users SET is_active = 0 where email in (\''+student_email+'\',\''+parent_email+'\')')
    .spread((result) => {
        if(result){
            done(null, "Users removed successfully")
        }else{
            done("Problem deleting user")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.updateUser = (body, done) => {
    var query = [
        'UPDATE Students set name = \''+body.studentName+'\' where email = \''+body.studentEmail+'\';',
        'UPDATE Parents set name = \''+body.parentName+'\', phone_number = \''+body.phone_number+'\' where email = \''+body.parentEmail+'\';'
    ].join(' ')

    db.query(query,{
        raw: true
    })
    .spread((result) => {
        if(result){
            done(null, "Student updated successfully")
        }else{
            done("Problem updating user")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.getTeachers = (done) => {
    Teacher.findAll({
        attributes: ['id','name', 'email', 'standard_id', 'division_id']
    })
        .then((data) => {
            done(null, data)
        }).catch((err) => {
        done(err)
    })
}

exports.classList = (done) => {
    db.query('SELECT COUNT(Students.id) AS students_count, Divisions.division, Divisions.id, Standards.standard, Teachers.name FROM Students, Divisions, Standards, Teachers where Standards.id = Students.standard_id and Divisions.id = Students.division_id AND Teachers.standard_id = Standards.id AND Teachers.division_id = Divisions.id GROUP BY Students.division_id')
    .spread((data) => {
        done(null, data)
    }).catch((err) => {
        done(err)
    })
}

exports.unassignTeacher = (teacher_id, done) => {
    Teacher.find({
        where: {
            id: teacher_id
        }
    }).then((teacher) => {
        teacher.updateAttributes({
            standard_id: null,
            division_id: null
        }).then((updateTeacher) => {
            if(updateTeacher){
                done(null, "Teacher un-assigned successfully")
            }else{
                done("Problem updating teacher")
            }
        }).catch((err) => {
            done(err)
        })
    }).catch((err) => {
        done(err)
    })
}

exports.forgotPassword = (email, done) => {
    User.find({
        where: {
            email: email
        }
    }).then((user) => {
        if(user){
            var randomNumber = otpGenerator.generate(6, {
                digits: true,
                alphabets: false,
                specialChars: false,
                upperCase: false
            });

            var result = {
                randomString: randomNumber,
                message: "Code sent on your mail.",
                email: email
            }

            var mailOptions = {
                from: userEmailInfo.emailInfo,
                to: email,
                subject: 'Reset password',
                text: 'Please use this number to update your password \n'+randomNumber
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    done(error)
                } else {
                    console.log('Email sent: ===========\n' + info.response);
                    done(null, result);
                }
            });
        }else{
            done("No user available with this email")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.resetPassword = (email, password, done) => {
    User.find({
        where: {
            email: email
        }
    }).then(async (user) => {
        if(user){
            user.updateAttributes({
                password: await generateHash(password)
            }).then((updated) => {
                if(updated){
                    done(null, "Password updated successfully")
                }else{
                    done("Problem updating password")
                }
            }).catch((err) => {
                done(err)
            })
        }else {
            done("Invalid email")
        }
    }).catch((err) => {
        done(err)
    })
}