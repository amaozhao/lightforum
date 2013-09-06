/*global define*/
define([
	'underscore',
	'backbone',
	'models/user'
], function (_, Backbone, UserModel) {
	'use strict';

	var UserCollection = Backbone.Collection.extend({
		model: UserModel,

		url: "/api/myfollowing/",

		parse: function(response) {
		    this.next = response.next;
		    return response.results;
	    },
	});

	return UserCollection;
});