/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'collections/simpletopic',
	'views/simpletopic',
	'text!templates/sidebartopiclist.html'
], function (
	$, 
	_, 
	underi18n,
	Backbone, 
	zh_CN,
	SimpleTopicCollection,
	SimpleTopicView,
	sidebartopiclistTemplate) {
	'use strict';

	var SimpleTopicListView = Backbone.View.extend({
		// template: _.template(sidebartopiclistTemplate),

		initialize: function (options) {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(sidebartopiclistTemplate, locale));
		
			this.usertopics = new SimpleTopicCollection();
			this.usertopics.url = '/api/users/' + options.topic + '/simpletopic';
			this.usertopics.fetch();
			this.listenTo(this.usertopics, 'all', this.render);
			// this.listenTo(this.model, 'add', this.render);

			_.bindAll(this, 'render');
		},

		render: function () {
			this.$el.html(this.template);
			this.$el.html(this.usertopicaddAll());
			return this;
		},

		usertopicaddOne: function (topic) {
			var view = new SimpleTopicView({ model: topic });
			this.$el.find('.panel-body').append(view.render().el);
		},

		usertopicaddAll: function () {
			this.usertopics.each(this.usertopicaddOne, this);
		},
	});

	return SimpleTopicListView;
});
