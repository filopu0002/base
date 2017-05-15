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
	};

	// Load the current post
	view.on('init', function(next) {

		var q = keystone.list('Pays').model.find();
    console.log("Q ----> ", q);
		q.exec(function(err, results) {
      console.log("================ ----> ", results);
			locals.data.pays = results;
			next(err);
		});

	});

	// Load other posts
	// view.on('init', function(next) {
  //
	// 	var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
  //
	// 	q.exec(function(err, results) {
	// 		locals.data.posts = results;
	// 		next(err);
	// 	});
  //
	// });

	// Render the view
	view.render('pays');
};
