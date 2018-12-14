const mysql = require('mysql');
const fs = require('fs')
const DBconfig = JSON.parse(fs.readFileSync('./env.json')).mySQL
DBconfig.multipleStatements = true;//强制多条语句
const conn = mysql.createConnection(DBconfig);

const SQLs = [{ //填写sql语句
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
    var argv = process.argv[2];
    var sqls = (argv=='up')?(SQLs.map(act =>act.up)):(SQLs.map(act =>act.down).reverse());
    var query = getQuery(sqls);
    conn.query(query,(err,data)=>{
        if(err) {
            console.log('failed: ',err);
            process.exit(1)
        }
        else {
            console.log('success.');
            process.exit(0);
        }
    })
}

getQuery = (sqls)=>{
    var query = '';
    for(var i=0;i<sqls.length;i++) {
        var sql = sqls[i]; 
        var length = sql.length;
        if (sql[length-1]!=';') {
            sql += '; ';
        }
        query += sql;
    }
    return query;
}

start();