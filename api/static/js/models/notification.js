/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var NotificationModel = Backbone.Model.extend({

		url: '/api/users/auth',

		defaults: {
		    "id": 1, 
		    "owner": "", 
		    "member": [], 
		    "topic_id": "", 
		    "topic_title": "", 
		    "member_count": 0
		},
	});

	return NotificationModel;
});