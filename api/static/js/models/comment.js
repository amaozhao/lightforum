/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var CommentModel = Backbone.Model.extend({

		defaults: {
		    "avatar":  "",
		    "markdown":     "",
		    "author":    "",
		    "editable": false,
		    "content": "",
		    "created": "",
		    "updated": "",
	  	},
	});

	return CommentModel;
});