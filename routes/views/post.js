var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
	};
	locals.data = {
		posts: [],
		continent: [],
		pays: [],
		date: [],
	};

	// Load the current post
	view.on('init', function(next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('author categories pays');

		q.exec(function(err, result) {
			//item._.createdDate.format('YYYY-MM-DD')

			locals.data.post = result;
			locals.data.date = locals.data.post._.publishedDate.format('DD MMMM YYYY');


			//console.log('result', locals.data.post.publishedDate);
		//	var dateR = locals.data.post.publishedDate;
			//var dateSplit = dateR.split("-")
		//	console.log("DATE______ ", dateR);
			if(locals.data.post!= null && locals.data.post.pays!= null && locals.data.post.pays[0]){
				locals.data.pays = locals.data.post.pays[0].key;
			}
			next(err);
		});

	});

	view.on('init', function(next){
		console.log('init');
		if(locals.data.post != null && locals.data.post.pays != null && locals.data.post.pays[0]){
			var q = keystone.list('Pays').model.findOne({
				key: locals.data.pays,
			}).populate('continent');
			//console.log("destinationsTab", locals.data.continent);

			q.exec(function(err, result) {
				console.log('continent ===================', result.continent);
				locals.data.continent = result.continent;
				next(err);
			});
		}
		else{
			res.redirect('/404');
		}
	});


	// Load other posts
	view.on('init', function(next) {
		console.log("Load other posts");
		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function(err, results) {
			locals.data.posts = results;
			console.log("resuls ------------------------", locals.data.post);
			next(err);
		});

	});

	// Render the view
	view.render('post');
};
