/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'models/simpleuser',
	'text!templates/navbar.html',
	'collections/notification',
	'views/notificationlist',
	'jquery.bootstrap'
], function ($, _, underi18n, Backbone, zh_CN, SimpleUserModel, navbarTemplate, NotificationCollection, NotificationListView) {
	'use strict';

	var NavBarView = Backbone.View.extend({


		// template: _.template(underi18n.template(navbarTemplate, this.locale)),

		// The DOM events specific to an item.
		events: {
            "keypress .nav-search":		"search",
            "click .contact":   "contact",
            "click .about": "about",
            "click .home": "home",
            "click .nav-signin": "signin",
            "click .nav-signup": "signup",
            "click .myfollowing": "myfollowing",
            "click .myfans": "myfans",
            "click .profile": "profile",
            "mouseenter .notification-tooltip": "tooltip",
			"mouseleave .notification-tooltip": "hidetooltip",
			"click .notification-popover": "showpopover",
			"click .notification-none": "noshowpopover",
			"click .popover .alert-link": "notification",
			"click .popover .last .btn-xs": "setread",
		},

		initialize: function (options) {
			this.options = options;
			var zh = new zh_CN();
			var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(navbarTemplate, locale));
			this.fetchnotify = false;
			if(window.currentuser){
				this.notificationcollection = new NotificationCollection();
				this.model = window.currentuser;
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.model, 'add', this.render);
			}
		},

		render: function () {
			this.$el.html('');
			this.$el.html(this.template(this.model.toJSON()));
			$('.nav .active').removeClass('active');
			if(this.options && this.options.active){
				this.$el.find('.nav .' + this.options.active).addClass('active');
			}
			return this;
		},

		signin: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate("signin", {trigger: true, replace: true});
		},

		signup: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate("signup", {trigger: true, replace: true});
		},

		home: function(e){
		    e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate("", {trigger: true, replace: true});
		},
		
		about: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate('about', {trigger: true, replace: true});
		},

		contact: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate('contact', {trigger: true, replace: true});
		},

		search: function(e){
			if (e.which !== 13) {
				return;
			}
			var keyword = this.$el.find('.nav-search').val().trim();
			this.$el.find('.nav-search').val('');
            Backbone.history.navigate('search/'+keyword, {trigger: true, replace: true});
		},

		myfollowing: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate('myfollowing', {trigger: true, replace: true});
		},

		myfans: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate('myfans', {trigger: true, replace: true});
		},

		profile: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate('profile', {trigger: true, replace: true});
		},

		notification: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            var $target = $(e.target);
            var href = $target.attr('href');
            Backbone.history.navigate(href, {trigger: true, replace: true});
		},

		setread: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            var self = this;
            var csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');
            $.ajax({
            	type: 'POST',
				url: self.notificationcollection.url,
				dataType: 'json',
				data: {csrfmiddlewaretoken: csrfmiddlewaretoken },
				}).done(function(data) {
					self.notificationcollection.set(data);
					self.model.set("notifications", 0);
					self.render();
				});
		},


		tooltip: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            if(!this.fetchnotify){
            	this.notificationcollection.fetch();
            	this.fetchnotify = true;
            }
            this.$el.find('.notification-tooltip').tooltip('show');
		},

		hidetooltip: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.notification-tooltip').tooltip('hide');
		},

		showpopover: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            var notificationlistview = new NotificationListView({collection: this.notificationcollection});
            var content = notificationlistview.render().el.innerHTML + '';
            this.$el.find('.notification-popover').attr('data-content', content);
            if(this.$el.find('.popover').length) {
            	this.$el.find('.notification-popover').popover("destroy");
            } else {
	            this.$el.find('.notification-popover').popover("show");
            }
		},

		noshowpopover: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
		},

	});

	return NavBarView;
});