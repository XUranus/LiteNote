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

function handle_and_response(err,data,res) {
    if(err) {
        console.log(err);
        res.json({
            success:false,
            msg:'internal error.'
        }).end();
    } else res.json({
        success:true,
        data:data
    }).end();
}

function handle_modify_result(err,data,res) {
    if(err) {
        console.log(err);
        res.json({
            success:false
        }).end();
    } else res.json({
        success:true
    }).end();
}

function to_md5(str) {
    const md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

module.exports = () =>{
    const userRouter = express.Router();
    userRouter.use(multipart);//支持 multipart-form xhr request
    
    var user_id;


    //公开接口
    userRouter.post('/login',(req,res)=>{
        var user_mail = req.body.user_mail;
        var user_pass = req.body.user_pass;
        conn.query(`select * from user 
            where user_mail = '${user_mail}' and user_pass = '${to_md5(user_pass)}'`
            ,(err,data)=>{
                if(err) {
                    console.log(err);
                    res.json({
                        success:false,
                        msg:'internal error.'
                    }).end();
                } else if(data.length==1){
                    req.session['user_id'] = data[0].user_id;
                    res.json({success:true}).end();
                } else {
                    res.json({
                        success:false,
                        msg:'用户名密码不正确'
                    }).end();
                }
        });
    });

    userRouter.post('/register',(req,res)=>{
        var user_name = req.body.user_name;
        var user_pass = req.body.user_pass;//decoded
        var user_mail = req.body.user_mail;
        var user_avatar = req.body.user_avatar;
        var user_space_capacity = 1000000;
        conn.query(`insert into user 
            (user_name,user_pass,user_mail,user_avatar,user_space_capacity) 
            values 
            ('${user_name}','${to_md5(user_pass)}','${user_mail}','${user_avatar}',${user_space_capacity})`
        ,(err,data)=>{
            if(err) {
                console.log(err);
                res.json({success:false,msg:'internal error'}).end();
            } else {
                var user_id = data.insertId;
                req.session['user_id'] = user_id;
                res.json({
                    success:true
                }).end();
            }

        });
    });

    //中间件,向下过滤
    userRouter.use('/',(req,res,next)=>{
        if(req.session['user_id']==null) 
            res.json({
                success:false,
                msg:'you are not logged'
            }).end();
        else {
            user_id = req.session['user_id'];
            next();
        }
    });


    //用户接口
    userRouter.post('/getInfo',(req,res)=>{
        conn.query(`select * from user 
            where user_id = ${user_id}`,
        (err,data)=>{
            if(err||data.length!=1){
                console.log(err);
            } else {
                res.json({success:true,data:data[0]}).end();
            }
        })
    });

    userRouter.post('/modifyInfo',(req,res)=>{
        var user_name = req.body.user_name;
        var user_avatar = req.body.user_avatar;
        var user_mail = req.body.user_mail;
        conn.query(`update user 
        set user_name = '${user_name}',
        user_avatar = '${user_avatar}',
        user_mail = '${user_mail}'
        where user_id = ${user_id}`
        ,(err,data)=>{handle_modify_result(err,data,res)});
    });


    userRouter.post('/uploadImage',(req,res)=>{
        //上传图片 返回地址 （内建cdn）

    });

    userRouter.post('/updatePassword',(req,res)=>{
        var user_pass = req.body.user_pass;
        conn.query(`update user 
        set user_pass = ${user_pass} 
        where user_id = ${user_id}`
        ,(err,data)=>{handle_modify_result(err,data,res)});
    });

    userRouter.post('/logout',(req,res)=>{
        req.session['user_id'] = null;
        res.json({success:true,msg:'退出成功！'}).end();
    });

    return userRouter;
}