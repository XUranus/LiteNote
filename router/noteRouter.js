const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const conn = require('../mysqlConn')();
const crypto = require('crypto');
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

function note_access_privilege(note_id,user_id,access) {
    conn.query(`select user_id from note 
    where note_id = ${note_id}`,(err,data)=>{
        if(err||data.length!=1) 
            access(false);
        else {
            if(data[0].user_id == user_id) 
                access(true);
            else access(false);
        }
    });
}


function make_unauthorized_res(res){
    res.json({
        success:false,
        msg:'you are unauthorized to acesss'
    }).end();
}

function generate_note_token(token) {
    function note_token_exist(token,exist) {
        conn.query(`select * from note 
        where token = '${token}'`,(err,data)=>{
            if(err){
                console.log(err);
                exist(true);
            } else {
                exist(data.length>0);
            }
        });
    }

    function new_note_token(str) { //随机hash
        var obj = crypto.createHash('md5');
        obj.update(str);
        return obj.digest('hex');//十六进制表示的字符串
    }

    token(new_note_token(Math.random().toString()));
}

module.exports = () =>{
    const noteRouter = express.Router();
    noteRouter.use(multipart);//支持 multipart-form xhr request
    
    var user_id;

    //中间件,向下过滤
    noteRouter.use('/',(req,res,next)=>{ //用户验证(必须)
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

    noteRouter.use('/',(req,res,next)=>{ //笔记权限验证
        var note_id = req.body.note_id;
        note_access_privilege(note_id,user_id,(access)=>{
            if(note_id==null||access) next();
            else make_unauthorized_res(res);
        });
    });

    //权限安全的私有接口：
    noteRouter.post('/getNotesList',(req,res)=>{ //概要信息
        conn.query(
            `select note_id,note_title,note_format,modify_at from note 
            where user_id = ${user_id}`
        ,(err,data)=>{handle_and_response(err,data,res)});
    });

    noteRouter.post('/getNote',(req,res)=>{
        var note_id = req.body.note_id;
        conn.query(
            `select note_id,note_title,content,note_format,create_at,modify_at,token from note 
            where user_id = ${user_id} and note_id = ${note_id}`
        ,(err,data)=>{handle_and_response(err,data,res)});
    });
    
    noteRouter.post('/getNoteToken',(req,res)=>{
        var note_id = req.body.note_id;
        conn.query(`select token from note 
            where user_id = ${user_id} and note_id = ${note_id}`
        ,(err,data)=>{handle_and_response(err,data,res)});
    });

    noteRouter.post('/modifyNoteTitle',(req,res)=>{
        var note_title = req.body.note_title;
        var note_id = req.body.note_id;
        conn.query(`update note 
        set note_title = ${note_title} 
        where note_id = ${note_id}`
        ,(err,data)=>{handle_modify_result(err,data,res)});
    });

    noteRouter.post('/modifyNoteContent',(req,res)=>{ //高并发接口 
        var content = req.body.content;
        var note_id = req.body.note_id;
        conn.query(`update note 
        set content = '${content}' 
        where note_id = ${note_id}`
        ,(err,data)=>{handle_modify_result(err,data,res)});
    });

    noteRouter.post('/deleteNote',(req,res)=>{
        var note_id = req.body.note_id;
        conn.query(`delete from note 
        where note_id = ${note_id}`
        ,(err,data)=>{handle_modify_result(err,data,res)});
    });

    noteRouter.post('/newNote',(req,res)=>{
        var note_title = req.body.note_title;
        var content = '';
        var note_format = req.body.note_format;
        generate_note_token((token)=>{
            conn.query(`insert into note 
            (note_title,content,note_format,user_id,token) 
            values 
            ('${note_title}','${content}','${note_format}',${user_id},'${token}')`
            ,(err,data)=>{
                if(err) {
                    console.log(err);
                    res.json({success:false,msg:'internal error'}).end();
                } else {
                    res.json({success:true,note_id:data.insertId,token:token}).end();
                }
            });
        });
    });

    return noteRouter;
}