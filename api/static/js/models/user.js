/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var UserModel = Backbone.Model.extend({

		defaults: {
		    "id": 1, 
		    "username": "", 
		    "email": "", 
		    "avatar": "http://www.gravatar.com/avatar/", 
		    "topiccount": 0,
		    "commentcount": 0,
		    "gender": "", 
		    "fans": 0, 
		    "following": 0, 
		    "signature": "",
		    "is_following": false, 
		},
	});

	return UserModel;
});