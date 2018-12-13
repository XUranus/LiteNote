const express = require('express');

module.exports = ()=>{
    const apiRouter = express.Router();

    apiRouter.all('*',(req,res,next)=>{ //允许跨域
        res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Credentials",true); //带cookies7     
        res.header("Content-Type", "application/json;charset=utf-8");

        console.log(req.body);
        next();
    });

    apiRouter.use('/user',require('./userRouter')());
    apiRouter.use('/note',require('./noteRouter')());
    apiRouter.use('/share',require('./shareRouter')());
    apiRouter.use('/image',require('./imageRouter')());

    return apiRouter;
}