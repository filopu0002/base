var keystone = require('keystone');
Post = keystone.list('Post');
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
    Post.model.find()
    .where('state', 'published')
    .populate('author')
    .sort('-publishedDate')
    .limit(4)
    .exec(function(err, results) {
        locals.data.posts = results;
	    next(err);
    });
	/* view.on('init', function(next) {
		var q = keystone.list('Post').find()
            .where('state', 'published')
			.sort('-publishedDate')
			.limit(4)
			.populate('author');

		q.exec(function(err, results) {

			locals.data.posts = results;
			next(err);
		});*/
		// console.log("------------ RESULT --------------", locals.data.results );
	});
	// Render the view
	view.render('index');
};
