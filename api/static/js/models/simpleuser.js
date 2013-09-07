/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var SimpleUserModel = Backbone.Model.extend({

		url: '/api/users/auth',

		defaults: {
		    "id": 1, 
		    "username": "", 
		    "email": "", 
		    "avatar": "http://www.gravatar.com/avatar/", 
		    "is_authenticated": false,
		    "notifications": 0,
		},
	});

	return SimpleUserModel;
});