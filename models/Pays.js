var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * PostCategory Model
 * ==================
 */

var Pays = new keystone.List('Pays', {
	autokey: { from: 'name', path: 'key', unique: true },
	track: true,
});

Pays.add({
	name: { type: String, required: true },
	type: { type: Types.Select, options: "l', le , la , les , sans", default: 'sans', index: true, required: true},
	image: { type: Types.CloudinaryImage, select : true},
	descriptions: {type: Types.Html, wysiwyg: true, height: 400 },
	continent: { type: Types.Relationship, ref: 'destinations'},
});

Pays.relationship({ ref: 'Post', path: 'pays' });

Pays.register();
