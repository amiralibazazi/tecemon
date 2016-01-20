module.exports = function(app) {
	
	var options = {
		dotfiles: 'ignore',
		root: "./public/",
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true,
		}
	}

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
}