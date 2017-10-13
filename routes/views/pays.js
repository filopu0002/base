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
		type: [],
		date:[],
	};

	// Load the current country
	view.on('init', function(next) {

		var q = keystone.list('Pays').model.findOne({
		    key: locals.filters.pays,
		});

		q.exec(function(err, result) {

			if(result!= null){
				locals.data.pays = result;


				//manage the type before the name of country
				if(result.type ==  'sans' ){
					locals.data.type = "";
				}
				else{
					locals.data.type = result.type + " ";
				}
				next(err);
			}
			else{
				res.redirect('/404');
			}
		});

	});

	//Loads articles
	view.on('init', function(next, res) {

		var q = keystone.list('Post').model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('pays');
			q.where('pays').in([locals.data.pays]);
			q.exec(function(err, results) {
				// 	console.log("RESULTS PAYS --->", results);
				// console.log("locals.data.pays -->", locals.data.pays);

				locals.data.posts = results;


				next(err);
			});

});
	// Render the view
	view.render('pays');
};
