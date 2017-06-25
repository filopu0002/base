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
	var postsContinent = [];
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


	// function create(next) {
	//
	// }
	//
	// function searchIdDestinations(){
	// 	//console.log("LLLLLL", destinationsTab)
	// 	for(var i=0; i < destinationsTab.length; i++){
	// 		//console.log("locals.filters.destinations -->", locals.filters.destinations);
	// 		if(destinationsTab[i].key == locals.filters.destinations){
	// 			//console.log("TRUE");
	// 			contintentId = destinationsTab[i]._id;
	// 			break;
	// 		}
	// 	}
	// }

	//Cherche pays par rappport au continent
	view.on('init', function(next){
		var q = keystone.list('Pays').model.find().populate('continent');
		//console.log("destinationsTab", locals.data.continent);
		q.where('continent').in([locals.data.continent]);
		q.exec(function(err, results) {
			console.log(" Pays with continent---->", results)
			locals.data.pays = results;
			next(err);
		});
	});


	//Cherche articles par rapport au continent en passant par les pays du continent
	// Peut etre ajouter le continent dans l'article ?
	view.on('init', function(next) {
		var pays = [];

		var q = keystone.list('Post').model.find()
			.sort('-publishedDate')
			.populate('pays');

		q.exec(function(err, results) {

			if(locals.data.pays){
				for(var j=0; j < results.length; j++){
					for(i=0; i < locals.data.pays.length; i++){

						if(results[j].pays[0] && locals.data.pays[i].name == results[j].pays[0].name){
							console.log("results Post pays =", results[j].pays[0].name);
							console.log("results pays =",locals.data.pays[i].name );
							postsContinent.push(results[j]);
							pays.push(locals.data.pays[i]);
						}
					}
				}
				console.log(postsContinent);
				locals.data.posts = postsContinent;

				//Supprime les pays en double du aux posts
				function removeDuplicates(originalArray, prop) {
					 var newArray = [];
					 var lookupObject  = {};

					 for(var i in originalArray) {
							lookupObject[originalArray[i][prop]] = originalArray[i];
					 }

					 for(i in lookupObject) {
							 newArray.push(lookupObject[i]);
					 }
						return newArray;
				}

				var uniqueArray = removeDuplicates(pays, "_id");
				uniqueArray.sort();
				locals.data.pays = uniqueArray;
			}
			else{
				locals.data.posts = results;
			}
			next(err);
		});
	});


	// Render the view
	view.render('continent');
};
