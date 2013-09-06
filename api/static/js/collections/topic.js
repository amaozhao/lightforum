/*global define*/
define([
	'underscore',
	'backbone',
	'models/topic'
], function (_, Backbone, Topic) {
	'use strict';

	var TopicCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: Topic,

		url: function() {
		    var original_url = "/api/topics/";
		    var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) == '/' ? '' : '/' );

		    return parsed_url;
		},
		
		comparator: function(model) {
			return 0 - model.id;
		},

		parse: function(response) {
		    this.next = response.next;
		    return response.results;
	    },
	});

	return TopicCollection;
});