const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const conn = require('../mysqlConn')();
const multipart = require('connect-multiparty')();

module.exports = () =>{
    const shareRouter = express.Router();
    shareRouter.use(multipart);//支持 multipart-form xhr request

    //此处不需要中间件验证

    shareRouter.use('/getNote',(req,res)=>{
        var token = req.body.token;
        if(token==null) {
            res.json({
                success:false,
                msg:'no token'
            }).end();
        } else {
            conn.query(`select (note_title,content,note_format,create_at,modify_at,user_id) from note where token = ${token}`,(err,data)=>{
                if(err || data.length!=1) {
                    console.log(err);
                    res.json({
                        success:false,
                        msg:'token error'
                    }).end();
                } else {
                    res.json({
                        success:true,
                        data:data[0]
                    }).end();
                }
            });
        }
    });

    shareRouter.use('/getAuthorInfo',(req,res)=>{
        var user_id = req.body.user_id;
        if(user_id==null) {
            res.json({
                success:false,
                msg:'no user_id'
            }).end();
        } else {
            conn.query(`select (user_name,user_avatar) from user where user_id = ${user_id}`,(err,data)=>{
                if(err||data.length!=1) {
                    console.log(err);
                    res.json({
                        success:false,
                        msg:'user_id err'
                    }).end();
                } else {
                    res.json({
                        success:true,
                        data:data[0]
                    }).end();
                }
            });
        }
    });

    return shareRouter;
}