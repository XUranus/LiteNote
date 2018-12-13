const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const conn = require('../mysqlConn')();
const pathObj = require('path');
const multer = require('multer')

const upload = multer({dest:'./imageUploads/'});//设置存储的位置

module.exports = ()=>{
    const imageRouter = express.Router();
    var user_id;

    //中间件,向下过滤
    imageRouter.use('/',(req,res,next)=>{ //用户验证(必须)
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


    //私有路由
    imageRouter.post('/uploadImage',upload.single('img'),(req,res)=>{
        console.log(req.body);
        if(!req.file) { //没有文件
            res.json({msg:'没有选择文件！',success:false}).end();
        } else {
            console.log('====================================================');
            console.log('fieldname: ' + req.file.fieldname);
            console.log('originalname: ' + req.file.originalname);
            console.log('encoding: ' + req.file.encoding);
            console.log('mimetype: ' + req.file.mimetype);
            console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
            console.log('destination: ' + req.file.destination);
            console.log('filename: ' + req.file.filename);
            console.log('path: ' + req.file.path);
            

            var fileObj = pathObj.parse(req.file.originalname);
            newPath = req.file.path + fileObj.ext;
            oldPath = req.file.path;

            fs.rename(oldPath,newPath,(err)=>{
                if(err) {
                    console.log(err);
                    res.json({success:false,msg:'internal error'}).end();
                } else {
                    var image_file_name = req.file.filename + fileObj.ext
                    var image_size = req.file.size / 1024;

                    conn.query(`select user_space_capacity,user_space_used 
                    from user where user_id = ${user_id}`,(err,data)=>{
                        if(err || data.length!=1) {
                            console.log(err);
                            res.json({success:false,msg:'internal error'}).end();
                        } else {
                            data = data[0];
                            if(data.user_space_capacity < data.user_space_used + image_size) {
                                res.json({success:false,msg:'容量不足！'}).end();
                            } else {
                                conn.query(`insert into image 
                                (image_filename,image_size,image_uploader_id) 
                                values 
                                ('${image_file_name}',${image_size},${user_id})`
                                ,(err,data)=>{
                                    if(err) {
                                        console.log(err);
                                        res.json({success:false,msg:'internal error'}).end();
                                    } else {
                                        res.json({
                                            success:true,
                                            image_file_name:image_file_name
                                        }).end();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }

    });

    imageRouter.post('/deleteImage',(req,res)=>{ //同时删除文件！
        var image_id = req.body.image_id;
        conn.query(`select image_size 
        from image 
        where image_id = ${image_id}`
        ,(err,data)=>{
            if(err|data.length!=1) {
                console.log(err);
                res.json({success:false,msg:'internal error'}).end();
            } else {
                var image_size = data[0].image_size;
                conn.query(`update user 
                set user_space_used = user_space_used - ${image_size}`
                ,(err,data)=>{
                    if(err) {
                        console.log(err);
                        res.json({success:false,msg:'internal error'}).end();
                    } else {
                        conn.query(`delete from image 
                        where image_id = ${image_id}`,(err,data)=>{
                            if(err) {
                                console.log(err);
                                res.json({success:false,msg:'internal error'}).end();
                            } else {
                                res.json({success:true}).end();
                            }
                        })
                    }
                });
            }
        });
    });

    imageRouter.post('/allMyImage',(req,res)=>{
        conn.query(`select * from image where image_uploader_id = ${user_id}`
        ,(err,data)=>{
            if(err) {
                console.log(err);
                res.json({success:false,msg:'internal'}).end();
            } else {
                res.json({
                    success:true,
                    data:data
                }).end();
            }
        });
    });

    return imageRouter;
}