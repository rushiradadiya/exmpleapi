const nodeMailer = require('nodemailer');

exports.jwtConfig = {
    expireTime : '2h',
    secret : 'buddy_app'
}

exports.transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shivani.devtest12@gmail.com',
        pass: 'lanetteam1'
    }
});

exports.userEmailInfo = {
    emailInfo: 'shivani.devtest12@gmail.com'
}