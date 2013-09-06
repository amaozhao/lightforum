/*global define*/
define([
	'underscore',
	'backbone',
	'models/comment'
], function (_, Backbone, Comment) {
	'use strict';

	var CommentCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: Comment,
	});

	return CommentCollection;
});