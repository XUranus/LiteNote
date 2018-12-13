const mysql = require('mysql');
const fs = require('fs')

module.exports = () => {
	const DBconfig = JSON.parse(fs.readFileSync('./env.json')).mySQL
	const conn = mysql.createPool(DBconfig);
	return conn;
}
