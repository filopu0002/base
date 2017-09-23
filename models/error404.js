var keystone = require('keystone');
var Types = keystone.Field.Types;
 
var error404 = new keystone.List('error404', {
	autokey: { from: 'name', path: 'key', unique: true },
	track: true,
});

error404.add({
	name: { type: String, required: true },
	image: { type: Types.CloudinaryImage, select : true},
	descriptions: {type: Types.Html, wysiwyg: true, height: 400 },
});

error404.register();
