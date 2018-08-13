var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('./mysql.js');

app.use(session({secret:'whatkldsjfklj'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4416);

app.get('/', function(req,res, next){
	res.render('home');
});

app.get('/select', function(req,res,next){
		mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		var results = JSON.stringify(rows);
		res.send(results);
	});
});

app.get('/insert', function(req,res,next){
	var context = {};
	console.log(req.query);
	mysql.pool.query("INSERT INTO todo(name, done, due, reps, weight) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.done, req.query.due, req.query.reps, req.query.weight], function (err, result){
		if(err){
			next(err);
			return;
		}
		results = "Inserted id " + result.insertId;
		res.send(results);
	});
});

app.get('/edit', function(req, res, name){
	var context = {};

	context.id = req.query.id;
	mysql.pool.query('SELECT * FROM todo WHERE id = ?', [req.query.id], function(err, rows, fields){
		if (err){
			next(err);
			return;
		}
		context.name = rows[0].name;
		context.due = rows[0].due;
		context.reps = rows[0].reps;
		context.weight = rows[0].weight;
		context.done = rows[0].done
		res.render('edit', context);
	});
	//res.render("edit");
});
app.get('/update', function(req, res, next){
	var context = {};
	mysql.pool.query('UPDATE todo SET name=?, done=?, due=?, reps=?, weight=? WHERE id=? ',
		[req.query.name, req.query.done, req.query.due, req.query.reps, req.query.weight, req.query.id],
		function(err, result){
			if(err){
				next(err);
				return;
			}
			console.log(req.query.id);
			res.render('home');
		});
});
app.get('/delete', function(req,res,next){
	mysql.pool.query("DELETE FROM todo WHERE id = ?;", [req.query.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		results = "Deleted id ";
		res.send(results);
	});
});

app.get('/reset-table',function(req,res,next){
	var context = {};
	mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
		if(err){
			next(err);
			return;
		}
		var createString = "CREATE TABLE todo(" +
		"id INT PRIMARY KEY AUTO_INCREMENT," +
		"name VARCHAR(255) NOT NULL," +
		"reps VARCHAR(255)," +
		"weight VARCHAR(255)," +
		"done VARCHAR(255)," +
		"due DATE)";
		mysql.pool.query(createString, function(err){
			context.results = "Table reset";
			res.render('home',context);
		});
	});
});

/*
app.get('/count',function(req,res){
	var context = {};
	context.count = req.session.count || 0;
	req.session.count = context.count + 1;
	res.render('counter', context);
});
*/
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
