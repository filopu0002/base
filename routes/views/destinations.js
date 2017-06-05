var keystone = require('keystone');
	Post = keystone.list('Post');
	//Destinations = keystone.list('destinations');
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
		posts: [],
	};

	Post.model.find().populate('pays').exec(function(err, post) {
    // the author is a fully populated User document

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
			.populate('pays');

		q.exec(function(err, results) {

			locals.data.posts = results;

			//console.log("------------ RESULT --------------", results);
			next(err);
		});
		// console.log("------------ RESULT --------------", locals.data.results );
	});

//console.log("------------ RESULT --------------", locals.data.destinations );

	// Render the view
	view.render('destinations');
};
