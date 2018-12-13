const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const conn = require('./mysqlConn')();
const port = JSON.parse(fs.readFileSync('./env.json')).nodeServer.port;

var server = express();

server.set('trust proxy', 1);
server.use(cookieSession({
    name:'session',
    keys:['boy ♂ next ♂ door','thank ♂ you ♂ sir','deep ♂ dark ♂ fantasy'],
    maxAge:400*60*100
}));
server.use(cookieParser('Do you like van you ♂ xi'));

server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));



//测试用 等等删掉////

server.use('/',(req,res,next)=>{
    req.session['user_id'] = 1;
    next();
});


//////////



server.use('/api',require('./router/apiRouter')()); //api

server.get('/dash',(req,res)=>{ //static index.html
    res.sendFile(__dirname+'/build/index.html'); //之后再配置相对路径
}); 

server.get('/signin',(req,res)=>{ //static index.html
    res.sendFile(__dirname+'/build/index.html'); //之后再配置相对路径
}); 

server.get('/register',(req,res)=>{ //static index.html
    res.sendFile(__dirname+'/build/index.html'); //之后再配置相对路径
}); 

server.use('/img',express.static(__dirname + '/imageUploads'))

server.use('/',express.static(__dirname+'/build')); //static

server.listen(port);
console.log('Server Starting...port:',port);
