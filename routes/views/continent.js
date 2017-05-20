var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	// locals.section = 'destinationsPays';
  locals.filters = {
		destinations: req.params.destinations,
	};
	locals.data = {
		pays: [],
	};

  // charge le continent sélectionné :
	view.on('init', function(next) {

		var q = keystone.list('destinations').model.findOne({
		    key: locals.filters.destinations,
		});

		q.exec(function(err, result) {
			locals.data.continent = result;
			next(err);
		});

	});
console.log("------------ RESULT --------------", locals.data.continent );

	// Render the view
	view.render('continent');
};
