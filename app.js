const express = require('express');
const {signAccessToken} =require('./jwthelper');
var FCM = require('fcm-node');
const SERVER_KEY = 'AAAAtY-0bNw:APA91bGXKmpJ3cnjQL8sNICob_qEnuiSj-C18spDubGQeDpwPQKLaHxiGc-wOUAz98W8aF7OXzrbNBQ0EF9ZPb5lXybfw7Arcj-ZOwNaR_pp3kBK6WB2Bp79NboB9Lq2t9Vjep7U42IA';
const commentsMailer=require('./mailers/comments_mailer');
const pool=require('./database');
const comment={
    user:'aditya.aneja@minditsystems.com',
    name:'Aditya'
}
var app=express();



var port= process.env.PORT || 3000;


app.listen(port, ()=>{
    console.log('listening on port', port);
});

// use express router
app.use('/', require('./routes'));

//set up the view engine
app.set('view engine','ejs');
app.set('views','./views')

app.use(express.json());
app.use(express.urlencoded({extended:false}));

 var dbConn=pool.dbConn;
 dbConn.connect();

//function to call to Email 
//  commentsMailer.newComment(comment);

//fcm end point

// Generate Secret Key
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
//   var userID=uuid();
//   console.log("secret Key",userID);
// const accessToken=await signAccessToken(savedUser.ID);
// res.end({accessToken});

//Api to post secret key for each user

app.post('/user', function (req, res) {
    let user = req.body;
    if (!user) {
    return res.status(400).send({ error:true, message: 'Please provide user' });
    }
    console.log(user)
    console.log(user.name);
    user.secret_key = uuid();
let query ="INSERT INTO mindit_notification_engine.client_data (name,secret_key,creation_date,last_modified_date) VALUES (?, ?,?,?)";

  // Value to be inserted
  let userName = String(user.name);
  let secret_key =String(user.secret_key);
  let created=new Date();
    dbConn.query(query,[userName,
                 secret_key,
                        created,
                        created], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: secret_key, message: 'New user has been created successfully!' });
    });
    });




    //Authentication to verify secret Key

    app.get('/user/:id', function (req, res) {
        console.log(req.params);
        let user_id = req.params.id;

        if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
        }

       var query='SELECT secret_key FROM mindit_notification_engine.client_data where secret_key='+ user_id;
       console.log(query);
        //dbConn.query('SELECT secret_key FROM mindit_notification_engine.client_data where secret_key=?', user_id, function (error, results, fields) {
            dbConn.query('SELECT id,secret_key FROM mindit_notification_engine.client_data where secret_key=?', user_id, async function (error, results, fields) {
        
            if (error) {throw error};
         if(results.length>0){
            var id=String(results[0].id);
            const accessToken= await signAccessToken(id);
            console.log({accessToken});
            
        return res.send({ error: false, data: {accessToken}, message: 'users list' });
         }else{
            return res.send({ error: true, data: results, message: 'user not found' }) 
         }
    
        });
        });










app.post('/fcm',async(req,res,next)=>{
    try{
        let fcm = new FCM(SERVER_KEY);

        let message={
            to:'/topics/' +req.body.topic,
            notification:{
                title:req.body.title,
                body:req.body.body,
                sound:'default',
                "click_action":"FCM_PLUGIN_Activity",
                "icon": "fcm_push_icon",
            },
            data: req.body.data
        }

        console.log("line 41 message", message);
        fcm.send(message, (err,response)=>{
            if(err){
                next(err);
            }else{
                res.json(response);
            }
        })

    }catch(error){
       next(error);
    }
})