var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'pays';
	locals.filters = {
		pays: req.params.pays,
	};
	locals.data = {
		pays: [],
		posts: [],
	};

	// Load the current pays
	view.on('init', function(next) {

		var q = keystone.list('Pays').model.findOne({
		    key: locals.filters.pays,
		});

		q.exec(function(err, result) {
			console.log("locals.filters.pays", locals.filters.pays);
			locals.data.pays = result;
			next(err);
		});

	});
	view.on('init', function(next) {

		var q = keystone.list('Post').model.find()
			.sort('-publishedDate')
			.populate('pays');

		q.where('pays').in([locals.data.pays]);
		q.exec(function(err, results) {
 			console.log("RESULTS PAYS --->", results);
			locals.data.posts = results;
			next(err);
		});
});
	// Render the view
	view.render('pays');
};
