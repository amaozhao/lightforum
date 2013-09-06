/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/comment',
	'views/comment',
	'jquery.bootstrap',
	'jquery.spin'
], function ($, _, Backbone, CommentCollection, CommentView) {
	'use strict';

	var CommentListView = Backbone.View.extend({
		className: 'comments',

		initialize: function (options) {
			this.collection = new CommentCollection();
			this.collection.url = options.url;
			this.fetch();
        	this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'remove', this.render);
        	_.bindAll(this, 'render', 'addOne', 'addAll');
		},

		fetch: function(){
			this.collection.fetch();
		},

		render: function () {
			this.$el.html('');
		    this.$el.html(this.addAll());
		    return this;
		},

		addOne: function (comment) {
			var view = new CommentView({ model: comment });
			this.$el.append(view.render().el);
		},

		addAll: function () {
			this.collection.each(this.addOne, this);
		},
	});

	return CommentListView;
});