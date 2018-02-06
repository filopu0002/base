var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {
	debugger;
	var view = new keystone.View(req, res);
	var locals = res.locals;


	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		posts: [],
		categories: [],
	};

	// Load all categories
	view.on('init', function(next) {

		keystone.list('PostCategory').model.find().sort('name').exec(function(err, results) {
			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function(category, next) {

				keystone.list('Post').model.count().where('categories').in([category.id]).exec(function(err, count) {
					category.postCount = count;
					next(err);
				});

			}, function(err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	view.on('init', function(next) {
		console.log("1");
		if (req.params.category) {
			console.log("2");
			keystone.list('PostCategory').model.findOne({
				key: locals.filters.category
			}).exec(function(err, result) {
				console.log("3");
				console.log("locals.filters.category", locals.filters.category);
				console.log("locals.data.category", result);
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function(next) {
		console.log("4");
		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 8,
				maxPages: 10,
				filters: {
					state: 'published',
				},
			})
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			console.log("5");
			console.log("locals.data.category", locals.data.category);
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function(err, results) {
			console.log("6");

			locals.data.posts = results;

			// locals.data.posts.publishedDate = null;
			console.log("RESULTS _______Q", locals.data.posts);
			//console.log("locals.data.posts._.publishedDate.format('DD MMMM YYYY')", locals.data.posts._.publishedDate.format('DD MMMM YYYY'));
			next(err);
		});
	});

	// Render the view
	view.render('blog');
};
