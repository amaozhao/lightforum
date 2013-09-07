/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n/zh-cn',
	'text!templates/usertopicsidebar.html',
	'jquery.bootstrap'
], function ($, _, Backbone, zh_CN, usertopicsidebarTemplate) {
	'use strict';

	var SimpleTopicView = Backbone.View.extend({

		// template: _.template(usertopicsidebarTemplate),

		initialize: function (options) {
			var zh = new zh_CN();
		    this.locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(usertopicsidebarTemplate, this.locale));
			this.listenTo(this.model, 'change:title', this.render);
			this.listenTo(this.model, 'add', this.render);
			_.bindAll(this, 'render');
		},

		events: {
			"mouseenter a": "tooltip",
			"mouseleave a": "hidetooltip",
			"click a":      "topicdetail",
		},

		render: function () {
			this.$el.html('');
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		tooltip: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('a').tooltip('show');
		},

		hidetooltip: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('a').tooltip('hide');
		},

		topicdetail: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate("topic/"+this.model.id, {trigger: true, replace: true});
		},
	});

	return SimpleTopicView;
});