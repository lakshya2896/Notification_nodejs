

const nodemailer = require('nodemailer');
const ejs=require('ejs');
const path = require('path');



let transporter =nodemailer.createTransport({

  host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth: {
        user: 'mindhosting19@gmail.com',
        pass:'klvastdaldfcqvgi'

    }


    //service:'gmail',
    // host:'smtp.mailtrap.io',
    // port:587,
    // secure:false,
    // auth: {
    //     user: 'b4a956acb8c79c',
    //     pass:'41b9cbe3831a68'

    // }
})


let renderTemplate= (data,relativePath) =>{
    let mailHTML;
    ejs.renderFile(
          path.join(__dirname,'../views/mailers' , relativePath),
          data,
          function(err,template){
            if(err){
                console.log('Error in rendering template ');
                return;
            }
            mailHTML=template;

          }
    )

    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate, 
}