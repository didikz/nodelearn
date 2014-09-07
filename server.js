// BASE SETUP
// ==========================================================

// call packages
var express = require('express');		// call express
var app = express();					// define our app using express
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = require('express-myconnection');
// var mongoose = require('mongoose');
// var Bear = require('./app/models/bears');

// connect to mongodb database
// mongoose.connect('mongodb://localhost/nodeapi');

// connect to mysql database
app.use(
	connection(mysql, {
		host: 'localhost',
		user: 'root',
		password: 'root',
		port: 3306,
		database: 'nodeapi',
	}, 'request')
);

// configure app to use body-parser
// this will let us get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;	// set our port

// ROUTES FOR UR API
// ============================================================================
var router = express.Router();			// get an instance of express router

// use router middleware to use all request
router.use(function(req, res, next) {
	// do logging
	console.log('something is happening');
	next(); 							// make sure we go to the next route
});

// test route to make sure everything is working (Accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: "horray, you made it!" });
});

// on route that end in /bears
// ---------------------------------------------------------------------
router.route('/bears')
	
	// create a bear. Accessed at POST http://localhost:8080/api/bears
	.post(function(req, res) {

		// var bear = new Bear();					// create a new instance of the Bear model
		// bear.name = req.body.name;				// set the bears name (come from request)
		var bearName = req.body.name;

		req.getConnection(function(err, connection) {
			var data = {

				name: bearName,	
			};

			var query = connection.query('INSERT INTO bears SET ?', data, function(err, rows) {
			
				if(err)
					res.send(err);

				res.json({ message: 'bear created' });
			});
		});

		// save the bear and check errors
		// bear.save(function(err) {
		// 	if(err)
		// 		res.send(err);

		// 	res.json({ message: 'Bear created'});
		// });

	}) // end of post bear

	.get(function(req, res) {

		req.getConnection(function(err, connection) {
			
			var query = connection.query('SELECT * FROM bears', function(err, rows) {
			
				if(err)
					res.send(err);

				res.json({ 
					result: 'OK',
					bears: rows
				});
			});
		});
	}); // end of get all bear

// on route that end in /bears/:bear_id
// -------------------------------------------------------------------
router.route('/bears/:bear_id')
	
	.get(function(req, res) {

		var id = req.params.bear_id;
		
		req.getConnection(function(err, connection) {
			
			var query = connection.query('SELECT * FROM bears WHERE id = ?', id, function(err, rows) {
			
				if(err)
					res.send(err);

				res.json({ 
					result: 'OK',
					bear: rows
				});
			});
		});
	
	}) // end of GET all bear

	.put(function(req, res) {
		var id = req.params.bear_id;
		var data = {
			name: req.body.name
		}

		req.getConnection(function(err, connection) {
			
			var query = connection.query('UPDATE bears set ? WHERE id = ?', [data, id], function(err, rows) {
			
				if(err)
					res.send(err);

				res.json({ 
					message: 'bear has been updated'
				});
			});
		
		});

	}) // end of PUT data bear

	.delete(function(req, res) {

		var id = req.params.bear_id;

		req.getConnection(function(err, connection) {
			
			var query = connection.query('DELETE FROM bears WHERE id = ?', id, function(err, rows) {
			
				if(err)
					res.send(err);

				res.json({ 
					message: 'one bear has been deleted'
				});
			});
		
		});

	}); // end of DELETE bear

// REGISTER OUR ROUTES
// all of our route will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ==============================================================
app.listen(port);
console.log('running at ' + port);