var keystone = require('keystone');

/**
 * PostCategory Model
 * ==================
 */

var Pays = new keystone.List('Pays', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Pays.add({
	name: { type: String, required: true },
});

Pays.relationship({ ref: 'Post', path: 'pays' });

Pays.register();
