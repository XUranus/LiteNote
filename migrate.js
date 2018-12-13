const conn = require('./mysqlConn.js')();

const SQLs = [{
    up:
    `create table user (
        user_id int not null auto_increment,
        user_name varchar(50) not null,
        user_pass varchar(100) not null,
        user_mail varchar(50) not null,
        user_avatar varchar(100) not null,
        user_space_used int default 0,
        user_space_capacity int not null,
        unique(user_mail),
        primary key(user_id)
    );`,
    down:
    `drop table user`
},
{
    up: 
    `create table note (
        note_id int not null auto_increment,
        note_title varchar(100) not null,
        content text not null,
        note_format varchar(10) not null,
        create_at timestamp default CURRENT_TIMESTAMP,
        modify_at timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        user_id int not null,
        token varchar(100) not null,
        foreign key(user_id) references user(user_id),
        primary key(note_id)
    );`,
    down: 
    `drop table note`
},{
    up: 
    `create table image (
        image_id int not null auto_increment,
        image_filename varchar(50) not null,
        image_size double not null,
        image_uploader_id int not null,
        upload_at timestamp default CURRENT_TIMESTAMP,
        primary key(image_id),
        foreign key(image_uploader_id) references user(user_id)
    );`,
    down: 
    `drop table image`
}]

start=()=>{
    var excuted = 0;
    var totalSqls = SQLs.length;
    var argv = process.argv[2];
    var sqls = (argv=='up')?SQLs.map(act =>act.up):SQLs.map(act =>act.down).reverse();
    sqls.forEach((sql,index)=>{
        (()=>{
            conn.query(sql,(err,data)=>{
                console.log(sql);
                if(err) console.log(err);
                else {
                    console.log(++excuted+' sqls executed,'+(totalSqls-excuted)+' remain.');
                }
            });
        })();
    });
}

start();