/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var SimpleTopicModel = Backbone.Model.extend({

		initialize: function() {
		},

		defaults: {
			"id": "",
		    "title": "",
		    "created": "",
	  	},
	});

	return SimpleTopicModel;
});