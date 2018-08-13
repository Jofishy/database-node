var mysql = require('mysql');
var pool = mysql.createPool({
	host : 'classmysql.engr.oregonstate.edu', //'mysql.cs.orst.edu',
	user : 'cs290_fisherj2',
	password: '2260',
	database: 'cs290_fisherj2'
});

module.exports = {
	pool: pool
}
