/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var TopicModel = Backbone.Model.extend({
		urlRoot: '/api/topics',

		initialize: function() {
		},

		defaults: {
		    "avatar":  "",
		    "addcommentavatar": "",
		    "markdown":     "",
		    "author":    "",
		    "author_id":    "",
		    "author_gender": "male", 
		    "author_fans": 0, 
		    "author_followings": 0, 
		    "can_following": false,
		    "following": false,
		    "title": "",
		    "editable": false,
		    "commentable": false,
		    "created": "",
		    "cut_markdown": "",
	  	},
	});

	return TopicModel;
});