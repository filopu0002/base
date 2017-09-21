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
			.sort('-publishedDate')
			.populate('pays');
			q.where('pays').in([locals.data.pays]);
			q.exec(function(err, results) {
				// 	console.log("RESULTS PAYS --->", results);
				// console.log("locals.data.pays -->", locals.data.pays);

				locals.data.posts = results;

				//locals.data.posts._.publishedDate.parse('2013-12-04');
				console.log("json", locals.data.posts.ville);

				//
				for(j=0; j < locals.data.posts.length; j++){
					// var str = JSON.stringify(locals.data.posts);
					//
					// str = str.replace(/\"_id\":/g, "\"id\":");
					//
					// locals.data.posts = JSON.parse(str);

					// locals.data.posts.forEach(function(a) {
					//     a.publishedDate = a.publishedDate.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
					// });

					// console.log("locals.data.posts ------------------------------->", locals.data.posts)
					// console.log("locals.data.posts[j]._.publishedDate.format('DD MMMM YYYY')", locals.data.posts[j]._.publishedDate.format('DD MMMM YYYY'));
					// locals.data.date.push(locals.data.posts[j]._.publishedDate.format('DD MMMM YYYY'))
					// console.log("locals.data.posts ------------------------------->", locals.data.date)
				}

				// console.log("locals.data.posts ------------------------------->", locals.data.posts)
				//console.log(locals.data.date);
				//console.log("locals.data.posts", locals.data.posts);
				//locals.data.date = locals.data.posts._.publishedDate.format('DD MMMM YYYY');
				next(err);
			});

});
	// Render the view
	view.render('pays');
};
