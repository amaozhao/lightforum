/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'models/simpleuser',
	'text!templates/navbar.html',
	// 'i18n/zh-cn',
	'jquery.bootstrap'
], function ($, _, underi18n, Backbone, zh_CN, SimpleUserModel, navbarTemplate) {
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
		},

		initialize: function (options) {
			this.options = options;
			var zh = new zh_CN();
			var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(navbarTemplate, locale));
			if(options && options.user){
				this.model = options.user;
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.model, 'add', this.render);
				this.model.fetch();
				options.router.user = this.model;
			}
			_.bindAll(this, 'render', 'home', 'about', 'contact', 'search');
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
		}

	});

	return NavBarView;
});