var keystone = require('keystone');
modelDestinations = keystone.list('destinations');
modelPays = keystone.list('Pays');
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
		destinations: [],
		continent: [],
		allDestinations: [],
		paysSelect: [],
	};

	var destinationsTab = {};
	var contintentId = 0;
	var continentName = null;
	  // charge le continent sélectionné :
	view.on('init', function(next) {

		var q = keystone.list('destinations').model.findOne({
		    key: locals.filters.destinations,
		});

		q.exec(function(err, result) {
			locals.data.continent = result;
			next(err);
		});


		// modelDestinations.model.find()
		// .exec(function(err, results) {
		//
		// 	console.log("results", results);
		// 	destinationsTab = results;
		// 	searchIdDestinations();
		//
		// 	next(err);
		// });
	});


	function create(next) {

	}

	function searchIdDestinations(){
		console.log("LLLLLL", destinationsTab)
		for(var i=0; i < destinationsTab.length; i++){
			console.log("locals.filters.destinations -->", locals.filters.destinations);
			if(destinationsTab[i].key == locals.filters.destinations){
				console.log("TRUE");
				contintentId = destinationsTab[i]._id;
				break;
			}
		}
	}


	//function searchPaysEqualsToId(){

	//}


	//Cherche pays par rappport au continent
	view.on('init', function(next){
		var q = keystone.list('Pays').model.find().populate('continent');
		console.log("destinationsTab", locals.data.continent);
		//q.where('continent').in([locals.data.continent]);

		q.exec(function(err, results) {
      console.log("================ ----> ", results[1]);
			locals.data.paysSelect = results[1];
			locals.data.pays = results;

			next(err);
		});
	});


	//Cherche articles par rapport au continent en passant par les pays du continent
	// Peut etre ajouter le continent dans l'article ?
	view.on('init', function(next) {

		// var q = keystone.list('Post').model.find()
		// 	.sort('-publishedDate')
		// 	.populate('pays');

		//q.where('pays').in([locals.data.paysSelect]);


		//search

		keystone.list('Post').model.find().where('pays').in([locals.data.paysSelect]).exec(function(err, results) {
			console.log("------------ RESULT --------------", results);
			next(err);
		});
		// q.exec(function(err, results) {
		// 	locals.data.posts = results;
		// 	console.log("------------ RESULT --------------", results);
		// 	next(err);
		// });
	});


	// Render the view
	view.render('continent');
};
