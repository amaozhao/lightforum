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
		    "author_followings": 0,
		    "author_fans": 0,
		    "following": false,
		    "can_following": false,
	  	},
	});

	return CommentModel;
});