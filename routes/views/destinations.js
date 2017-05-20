var keystone = require('keystone');
	Post = keystone.list('Post');
exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	// locals.section = 'destinationsPays';
	// locals.filters = {
	// 	pays: req.params.pays,
	// };
	locals.data = {
		pays: [],
    destinations: [],
	};

	Post.model.find().where('author', author.id).exec(function(err, posts) {
    // ...
	});


 	//Continents
  view.on('init', function(next) {

    var q = keystone.list('destinations').paginate({
				page: req.query.page || 1,
			});

    q.exec(function(err, results) {

      locals.data.destinations = results;
			console.log("RESULTS ====> results", results);
      next(err);
    });

  });


	//Articles
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

			console.log("------------ RESULT --------------", results);
			next(err);
		});
		// console.log("------------ RESULT --------------", locals.data.results );
	});

console.log("------------ RESULT --------------", locals.data.destinations );

	// Render the view
	view.render('destinations');
};
