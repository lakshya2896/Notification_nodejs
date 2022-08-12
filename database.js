var mysql  = require('mysql2');

module.exports.dbConn = mysql.createConnection({
    host:"103.234.187.254",
    user:"mindit_dev",
    password:"mindit@123"
    
})




// module.exports.data =pool.query(`select id,firstName,lastName from mindit_notification_engine.users`,(err,res)=>{
//     if(err){
//         return console.log("error",err);
//     }
//     return console.log(res);
// });
// dbConn.connect();