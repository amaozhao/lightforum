/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'text!templates/notificationlist.html',
	'views/notification',
	'jquery.bootstrap',
	'jquery.spin'
], function ($, _, underi18n, Backbone, zh_CN, notificationlistTemplate, NotificationView) {
	'use strict';

	var NotificationListView = Backbone.View.extend({

		// template: _.template(notificationlistTemplate),

		initialize: function (options) {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(notificationlistTemplate, locale));

        	this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'remove', this.render);
        	_.bindAll(this, 'render', 'addOne', 'addAll');
		},

		fetch: function(){
			this.collection.fetch();
		},

		render: function () {
			this.$el.html(this.template);
		    this.$el.html(this.addAll());
		    return this;
		},

		addOne: function (notification) {
			var view = new NotificationView({ model: notification });
			this.$el.find('.list-group .last').before(view.render().el);
		},

		addAll: function () {
			this.collection.each(this.addOne, this);
		},
	});

	return NotificationListView;
});