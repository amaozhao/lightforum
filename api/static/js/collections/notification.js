/*global define*/
define([
	'underscore',
	'backbone',
	'models/notification'
], function (_, Backbone, NotificationModel) {
	'use strict';

	var NotificationCollection = Backbone.Collection.extend({
		model: NotificationModel,
		url: '/api/notifications/',
	});

	return NotificationCollection;
});