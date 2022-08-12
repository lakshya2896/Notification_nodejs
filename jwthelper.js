const JWT = require('jsonwebtoken');
const createError =require('http-errors');
const { resolve } = require('path');

module.exports= {
    signAccessToken: (userId) =>{
        return new Promise((resolve,reject)  => {
            const payload={
             
            }
            const secret=" some super secret";
            const options={
                expiresIn:"30m",
                issuer:"demo.com",
                audience: userId,
            };
            JWT.sign(payload,secret,options,(err,token)=>{
if(err) reject(err);
resolve(token);
            })
        })
    }
}