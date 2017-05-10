var keystone = require('keystone');

/**
 * PostCategory Model
 * ==================
 */

var destinations = new keystone.List('destinations', {
	autokey: { from: 'name', path: 'key', unique: true },
});

destinations.add({
	name: { type: String, required: true },
});


destinations.register();
