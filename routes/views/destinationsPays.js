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
    destinations: [],
	};

	// Load the current post
	// view.on('init', function(next) {
  //
	// 	var q = keystone.list('Pays').model.find().populate('destinations');
  //   console.log("Q ----> ", q);
	// 	q.exec(function(err, results) {
  //     console.log("================ ----> ", results);
	// 		locals.data.pays = results;
	// 		next(err);
	// 	});
  //
	// });


  // view.on('init', function(next) {
  //
  //   var q = keystone.list('destinations').model.findOne({
  //     slugD: locals.filters.destinations,
  //   });
  //
  //   q.exec(function(err, result) {
  //     locals.data.destinations = result;
  //     next(err);
  //   });
  //
  // });

  view.on('init', function(next) {

    var q = keystone.list('destinations').model.find();

    q.exec(function(err, results) {
      console.log("RESULTS ====> results", results);
      locals.data.destinations = results;
      next(err);
    });

  });
  //
  // view.on('init', function(next) {
  //
  //   var q = keystone.list('Pays').model.findOne({
  //     slug: locals.filters.pays,
  //   });
  //
  //   q.exec(function(err, result) {
  //     locals.data.Pays = result;
  //     next(err);
  //   });
  //
  // });
  //
  // Load other posts
  // view.on('init', function(next) {
  //
  //   var q = keystone.list('Pays').model.find().populate('destinations');
  //
  //   q.exec(function(err, results) {
  //     locals.data.pays = results;
  //     next(err);
  //   });
  //
  // });



	// Render the view
	view.render('destinationsPays');
};
