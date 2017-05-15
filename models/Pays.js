var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * PostCategory Model
 * ==================
 */

var Pays = new keystone.List('Pays', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Pays.add({
	name: { type: String, required: true },
	continent: { type: Types.Relationship, ref: 'destinations'},
});

Pays.relationship({ ref: 'Post', path: 'pays' });

Pays.register();
