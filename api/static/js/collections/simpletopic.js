/*global define*/
define([
	'underscore',
	'backbone',
	'models/simpletopic'
], function (_, Backbone, SimpleTopicModel) {
	'use strict';

	var SimpleTopicCollection = Backbone.Collection.extend({
		model: SimpleTopicModel,
	});

	return SimpleTopicCollection;
});