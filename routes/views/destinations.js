var keystone = require('keystone');
	Post = keystone.list('Post');
	//Destinations = keystone.list('destinations');
exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	// locals.section = 'destinationsPays';
	// locals.filters = {
	// 	pays: req.params.pays,
	// };
	locals.data = {
		pays: [],
		paysBefore: [],
    destinations: [],
		posts: [],
		continents: [],
		continentsAvailable: [],
		postsPaysAvailable: [],
		paysAvailable: [],
		paysAndContinent: [],
	};

	Post.model.find().populate('pays').exec(function(err, post) {
    // the author is a fully populated User document
	});


	//Articles
	// Load all posts
	view.on('init', function(next) {

		var q = keystone.list('Post').model.find({
			state: 'published',
		}).populate('author categories pays');
		var postsPaysAvailable = [];
		q.exec(function(err, results) {
			//console.log('result', result);

			locals.data.posts = results;
			console.log("RESULTS ------>", results);
			for(var i=0; i < locals.data.posts.length; i++){
				//console.log(locals.data.posts[i].pays[0]);
				console.log("1");
				if(locals.data.posts[i].pays  && locals.data.posts[i].pays[0] != undefined){
					//console.log("2");
					locals.data.postsPaysAvailable.push(locals.data.posts[i].pays[0]);
				}
			}
			console.log("postsPaysAvailable", locals.data.postsPaysAvailable);


				function removePaysDuplicate(originalArray, prop) {
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

				var pays = removePaysDuplicate(locals.data.postsPaysAvailable, "_id");
				locals.data.paysBefore = pays;


				// var continents = removeDuplicatesByContinent(pays, "continent");
				// console.log("continents before is: ",continents);
				//locals.data.continents = locals.data.postsPaysAvailable;

				// console.log("continents is: ", locals.data.continents);
				// var str='{a:"www"}';
				// var outing = JSON.parse(locals.data.postsPaysAvailable[0]);
				// var str= locals.data.postsPaysAvailable[0];
				// console.log(" ===",locals.data.postsPaysAvailable[0]);
				// var obj=eval("("+str+")");
				// var obj = JSON.parse(locals.data.postsPaysAvailable[0]);
				// console.log("OBJECT ====>",outing);
				// console.log("postsPaysAvailable", typeof postsPaysAvailable[0]);
				// if(postsPaysAvailable){
				// 	for(var j=0; j < postsPaysAvailable; j++){
				//
				// 	}
				// }
			next(err);
		});

	});



 	//Continents == Destinations
  view.on('init', function(next) {
		//Récupère toute les destinations
    var q = keystone.list('destinations').model.find();

    q.exec(function(err, results) {
			var output = null;


      locals.data.destinations = results;
			for(var i=0; i < locals.data.destinations.length; i++){
				for(j=0; j < locals.data.continents.length ; j++){
					//Cherche si la destination i == au continent J
					//Si oui on l'ajoute.
					if(locals.data.destinations[i]._id.toString() === locals.data.continents[j].continent.toString()){

						locals.data.continentsAvailable.push(locals.data.destinations[i]);

					}
				}
			}
			// locals.data.continents.push(locals.data.continentsAvailable);
			// console.log("locals.data.continents", locals.data.continents);
			locals.data.continents = locals.data.continentsAvailable;
			locals.data.pays = locals.data.paysBefore;


			// console.log("pays is: ",locals.data.pays);
			// for(j=0; j < 1 ; j++){
			// 	//Cherche si la destination i == au continent J
			// 	//Si oui on l'ajoute.locals.data.continents[j];@
			// 	console.log("locals.data.continents[j] before", locals.data.continents[j]);
			//
			// 	// output["popo"] = 'null'
			// 	//
			// 	// console.log('output --->', output);
			// 	// delete output.popo;
			// 	// console.log('delete --->', output);
			// 	//console.log("typeof locals.data.continents[j]", typeof locals.data.continents[j]._id);
			// 	//console.log("locals.data.continents[j]", locals.data.continents[j])
			//
			// 	//console.log("locals.data.continents[j]", locals.data.continents[j])
			// 	output = locals.data.continents[j];
			// 	JSON.stringify(output);
			// 	// output["pppp"] = 'null'
			// 	//console.log('output --->', output);
			// 	console.log('output b--->', output.name);
			//
			// 	// delete output.name
			// 	console.log("typeof output", typeof output);
			// 	//
			// 	// console.log('output 2--->', output);
			// 	// console.log("locals.data.continents[j]",locals.data.continents[j]);
			// }
			// for(var i=0; i < locals.data.pays.length; i++){
			// 	for(j=0; j < locals.data.continents.length ; j++){
			// 		//Cherche si la destination i == au continent J
			// 		//Si oui on l'ajoute.
			// 		//output[j] = locals.data.continents[j];
			// 		if(locals.data.pays[i].continent.toString() === locals.data.continents[j]._id.toString()){
			// 			// function jsonConcat(o1, o2) {
			// 			//  for (var key in o2) {
			// 			//   o1[key] = o2[key];
			// 			//  }
			// 			//  return o1;
			// 			// }
			//
			// 			//output[j]["NAME"] = locals.data.pays[0][i];
			// 			console.log("pays continent is: ",output);
			// 			// output = jsonConcat(locals.data.continents[j], locals.data.pays[0][i]);
			// 		}
			// 	}
			// }
			// console.log("continents after is: ",locals.data.continents);

      next(err);
    });

  });




	// Render the view
	view.render('destinations');
};
