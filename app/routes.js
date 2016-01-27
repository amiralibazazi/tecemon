module.exports = function(app) {
	var bodyParser = require('body-parser');
	var multer = require('multer'); // v1.0.5

	var options = {
		dotfiles: 'ignore',
		root: "./public/",
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true,
		}
	}

	var savedFilters = [];

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
	});

	app.delete('/filters/:id', function(req, res) {
		var filterId = req.params.id
		console.log("Deleting filter with id : " + JSON.stringify(filterId));
		for (var i = savedFilters.length - 1; i >= 0; i--) {
    		if (savedFilters[i].id == filterId) {savedFilters.splice(i, 1);};
		};
	});
}