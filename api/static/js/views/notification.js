/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'text!templates/notification.html',
	'gfm',
	'jquery.bootstrap'
], function ($, _, underi18n, Backbone, zh_CN, notificationTemplate, GFM) {
	'use strict';

	var NotificationView = Backbone.View.extend({
		// template: _.template(commentTemplate),

		tagName: "li",

  		className: "list-group-item notification alert",

		events: {
			// "mouseenter .panel-heading":               "displaycommentconfig",
			// "mouseleave .panel-heading":               "hidecommentconfig",
			// "mouseenter .comment-user-img > img":      "popover",
			// "mouseleave .comment":                     "hidepopover",
			// "click .user-img":                         "usertopic",
   //          "click .edit-comment":                     "edit",
   //          "click .cancel":                           "cancel",
   //          "click .save":                             "save",
   //          "click .comment-friend":                   "addfriend",
		},

		initialize: function (options) {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(notificationTemplate, locale));
		
			this.options = options;
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'add', this.render);
			_.bindAll(this, 'render');
		},

		render: function () {
			this.$el.html('');
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

	});

	return NotificationView;
});
