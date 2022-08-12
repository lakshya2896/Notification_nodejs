const nodemailer = require('../config/nodemailer');


exports.newComment = (comment) =>{

    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')
    console.log('inside new comment mailer');

    nodemailer.transporter.sendMail({
        from:'mindhosting19@gmail.com',
        to:comment.user,
        subject:'send a mail from nodejs',
        html:htmlString
        },(err,info) =>{
            if(err){
                console.log('error in sending mail',err);
                return;
            }
            console.log('mail delivered', info);
            return;
        })
}