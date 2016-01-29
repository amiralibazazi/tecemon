module.exports = function(app) {
	var bodyParser = require('body-parser');
	var https = require('https');
	var multer = require('multer'); // v1.0.5

	var options = {
		dotfiles: 'ignore',
		root: "./public/",
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true,
		}
	}

	var teamcityOptions = {
			host: 'teamcity.dev.crwd.mx',
			path: '',
			port: 443,
			method: 'GET',
			headers: {
				"Content-Type":"application/json;charset=utf-8",
				"Accept":"application/json",
				"Authorization":"CHANGEME",
			}
	}

	var savedFilters = [];

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

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
		if (savedFilters.length == 1) {
			savedFilters = [];
		}
		for (var i = savedFilters.length - 1; i >= 0; i--) {
    		if (savedFilters[i].id == filterId) {savedFilters.splice(i, 1);};
		};
	});

	app.get('/teamcity/allBuilds', function(req, res) {
		console.log("getting request");
		var config = teamcityOptions;
		config.path = '/app/rest/buildTypes/?locator=count:10000';

		var request = https.request(config, function(response) {
		  console.log('statusCode: ', response.statusCode);

		  var bodyChunks = [];
		  response.on('data', function(chunk) {
		    bodyChunks.push(chunk);
		  }).on('end', function() {
		    var body = Buffer.concat(bodyChunks);
		    console.log('BODY: ' + body);
		    res.send(body);
		  })
		});

		request.end();
		request.on('error', function(e) {
		  console.error(e);
		});
	});

	app.get('/teamcity/lastCompletedBuild/:id', function(req, res) {
		var buildTypeId = req.params.id;

		var config = teamcityOptions;
		teamcityOptions.path = "/app/rest/buildTypes/id:"+buildTypeId+"/builds/?locator=running:(any)";

		var request = https.request(config, function(response) {
		  console.log('statusCode: ', response.statusCode);

		  var bodyChunks = [];
		  response.on('data', function(chunk) {
		    bodyChunks.push(chunk);
		  }).on('end', function() {
		    var body = Buffer.concat(bodyChunks);
		    console.log('BODY: ' + body);
		    res.send(body);
		  })
		});

		request.end();
		request.on('error', function(e) {
		  console.error(e);
		});
	})
}