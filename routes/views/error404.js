var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'error404';
	locals.data = {
		error404: [],
	};


	//Loads articles
	view.on('init', function(next, res) {

		var q = keystone.list('error404').model.find();
			q.exec(function(err, results) {
				locals.data.error404 = results;
				next(err);
			});

});
	// Render the view
	view.render('error404');
};
