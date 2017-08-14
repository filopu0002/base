var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * PostCategory Model
 * ==================
 */

var destinations = new keystone.List('destinations', {
	autokey: { from: 'name', path: 'key', unique: true },
});

destinations.add({
	name: { type: String, required: true },
	image: { type: Types.CloudinaryImage, select : true},
});


destinations.relationship({ ref: 'destinations', path: 'Pays' });

destinations.register();
