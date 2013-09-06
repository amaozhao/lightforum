/*global define*/
define([
	'jquery',
	'backbone',
	'collections/topic',
	'collections/user',
	'models/topic',
	'models/simpleuser',
	'views/topiclist',
	'views/topic',
	'views/navbar',
	'views/about',
	'views/contact',
	'views/sidebar',
	'views/signin',
	'views/signup',
	'views/profile',
	'views/nofound',
	'views/followinglist'
], function (
	$, 
	Backbone, 
	TopicCollection,
	UserCollection,
	Topic, 
	SimpleUserModel,
	TopicListView, 
	TopicView, 
	NavBarView, 
	AboutView, 
	ContactView,
	SideBarView,
	SigninView,
	SignupView,
	ProfileView,
	NoFoundView,
	FollowingListView) {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			"":                 "index",
			"topic/:id":        "detail",
			"user/:id":         "usertopics",
			"about": 			"about",
			"contact": 			"contact",
			"signin": 			"sigin",
			"signup": 			"sigup",
			"search/:keyword":  "search",
			"myfollowing":      "myfollowing",
			"myfans":           "myfans",
			"profile":           "profile",
			"*path":            "nofound",
		},
		
		initialize: function () {
		    this.user = new SimpleUserModel();
		    this.user.fetch();
			this.topiccollection = new TopicCollection();
		    this.topic = new Topic();
		},

		index: function () {
			$('.nosidebar').html('');
		    this.utils({active: 'home'});
		    this.topiccollection.url = '/api/topics/';
			$(".clearfix").html('');
		    this.mainview = new TopicListView({collection: this.topiccollection, user: this.user});
		    $(".clearfix").html(this.mainview.render().el);
		    var sidebarview = new SideBarView();
			$('#sidebar').html(sidebarview.render().el);
		},

		usertopics: function (id) {
			$('.nosidebar').html('');
		    this.utils({active: ''});
		    this.topiccollection.url = '/api/users/'+id+'/topic';
			$(".clearfix").html('');
		    this.mainview = new TopicListView({collection: this.topiccollection});
		    $(".clearfix").html(this.mainview.render().el);
		    var sidebarview = new SideBarView();
			$('#sidebar').html(sidebarview.render().el);
		},

		about: function() {
			$('.nosidebar').html('');
			this.utils({active: 'about'});
			$(".clearfix").html('');
			this.mainview = new AboutView();
		    $(".clearfix").html(this.mainview.render().el);
		    var sidebarview = new SideBarView();
			$('#sidebar').html(sidebarview.render().el);
		},

		contact: function() {
			$('.nosidebar').html('');
			this.utils({active: 'contact'});
			$(".clearfix").html('');
			this.mainview = new ContactView();
		    $(".clearfix").html(this.mainview.render().el);
		    var sidebarview = new SideBarView();
			$('#sidebar').html(sidebarview.render().el);
		},

		sigin: function() {
			if(this.user.get('is_authenticated')){
				Backbone.history.navigate("", {trigger: true, replace: true});
				return;
			} else {
				this.utils({active: ''});
				$(".clearfix").html('');
				$('#sidebar').html('');
				this.mainview = new SigninView();
			    $('.nosidebar').html(this.mainview.render().el);
			}
		},

		sigup: function() {
			if(this.user.get('is_authenticated')){
				this.navigate("", {trigger: true, replace: true});
				return;
			} else {
				this.utils({active: ''});
				$(".clearfix").html('');
				$('#sidebar').html('');
				this.mainview = new SignupView();
			    $('.nosidebar').html(this.mainview.render().el);
			}
		},

		detail: function(id) {
			$('.nosidebar').html('');
			this.utils({active: ''});
			$(".clearfix").html('');
			this.topic.set("id", id);
			this.topic.fetch();
			this.mainview = new TopicView({ model: this.topic, detail: true });
			$(".clearfix").html(this.mainview.render().el);
			var sidebarview = new SideBarView({topic: id});
			$('#sidebar').html(sidebarview.render().el);
		},
		
		search: function(keyword) {
			$('.nosidebar').html('');
			this.utils({active: ''});
		    this.topiccollection.url = '/api/topics/?keyword='+keyword;
		    $(".clearfix").html('');
		    this.mainview = new TopicListView({collection: this.topiccollection});
		    $(".clearfix").html(this.mainview.render().el);
		    $('.nav .active').removeClass('active');
		    var sidebarview = new SideBarView();
			$('#sidebar').html(sidebarview.render().el);
		},

		myfollowing: function() {
			$('.nosidebar').html('');
			this.utils({active: ''});
			this.friendcollection = new UserCollection();
			this.mainview = new FollowingListView({collection: this.friendcollection});
			$(".clearfix").html('');
		    $(".clearfix").html(this.mainview.render().el);
		    var sidebarview = new SideBarView();
			$('#sidebar').html(sidebarview.render().el);
		},

		myfans: function() {
			$('.nosidebar').html('');
			this.utils({active: ''});
			this.friendcollection = new UserCollection();
			this.friendcollection.url = '/api/myfans/'
			this.mainview = new FollowingListView({collection: this.friendcollection});
			$(".clearfix").html('');
		    $(".clearfix").html(this.mainview.render().el);
		    var sidebarview = new SideBarView();
			$('#sidebar').html(sidebarview.render().el);
		},

		nofound: function(path) {
			this.utils({active: ''});
			var nofoundview = new NoFoundView();
		    $('.clearfix').html('');
		    $('#sidebar').html('');
		    $('.nosidebar').html(nofoundview.render().el);
			$('.nav .active').removeClass('active');
		},

		profile: function() {
		    $(".clearfix").html('');
			this.utils({active: ''});
			var profileview = new ProfileView();
		    $(".clearfix").html(profileview.render().el);
		    var sidebarview = new SideBarView();
			$('#sidebar').html(sidebarview.render().el);
		},

		utils: function(options){
			if(typeof(this.navbarview) === 'undefined') {
				this.navbarview = new NavBarView({user: this.user});
			}
			$('.navbar-collapse.collapse').html('').prepend(this.navbarview.render().el);
			$('.nav .active').removeClass('active');
			if(options && options.active){
				$('.nav .' + options.active).addClass('active');
			}
		}
	});

	return Router;
});