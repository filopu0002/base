var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'aPropos';

	locals.data = {
		aPropos: [],
	};
	view.on('init', function(next) {

		var q = keystone.list('aPropos').model.findOne({
			state: 'published',
		});

		q.exec(function(err, result) {
			locals.data.aPropos = result;
			console.log("------- A PROPOS-------", result);
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
	view.render('aPropos');
};
