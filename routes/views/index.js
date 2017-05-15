var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;


	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		posts: [],
		categories: [],
	};

	view.on('init', function(next) {

		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				filters: {
					state: 'published',
				},
			})
			.sort('-publishedDate')
			.populate('author');

		q.exec(function(err, results) {

			locals.data.posts = results;

			// console.log("------------ RESULT --------------", results);
			next(err);
		});
		// console.log("------------ RESULT --------------", locals.data.results );
	});
	// Render the view
	view.render('index');
};
