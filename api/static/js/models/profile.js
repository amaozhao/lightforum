/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var ProfileModel = Backbone.Model.extend({

		url: '/api/profile/',
		
		initialize: function() {
		},

		defaults: {
			"user": "",
		    "gender": "",
		    "qq": "",
		    "weibo": "",
	  	},
	});

	return ProfileModel;
});