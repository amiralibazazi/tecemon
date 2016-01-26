module.exports = function(app) {


	var bodyParser = require('body-parser');
	var multer = require('multer'); // v1.0.5

	var savedFilters = [];
	
	var options = {
		dotfiles: 'ignore',
		root: "./public/",
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true,
		}
	}

	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode

	app.get('/', function(req, res) {
		res.sendFile('./index.html', options, function(err) {
			if (err) {
				console.log(err);
				res.status(err.status).end();
			} else {
				console.log('Redirecting to index.html');
			}
		});
	});

	app.post('/filters', function(req, res) {
		console.log("Successfully received filter : " + JSON.stringify(req.body));
		savedFilters.push(req.body);
	});

	app.get('/filters', function(req, res) {
		console.log("Retrieving filters : " + JSON.stringify(savedFilters));
		res.send(savedFilters);
	})
}