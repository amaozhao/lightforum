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
    'views/password_change',
    'views/password_reset',
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
    PasswordChangeView,
    PasswordResetView,
    NoFoundView,
    FollowingListView) {
    'use strict';

    var Router = Backbone.Router.extend({
        routes: {
            "":                  "index",
            "topic/:id":         "detail",
            "user/:id":          "usertopics",
            "about":             "about",
            "contact":           "contact",
            "signin":            "sigin",
            "signup":            "sigup",
            "search/:keyword":   "search",
            "myfollowing":       "myfollowing",
            "myfans":            "myfans",
            "profile":           "profile",
            "passwordchange":    "passwordchange",
            "passwordreset":    "passwordreset",
            "*path":             "nofound",
        },
        
        initialize: function () {
            window.currentuser = new SimpleUserModel();
            var id = $('meta[name="id"]').attr('content'),
                username = $('meta[name="username"]').attr('content'),
                email = $('meta[name="email"]').attr('content'),
                notifications = parseInt($('meta[name="notifications"]').attr('content')),
                avatar = $('meta[name="avatar"]').attr('content'),
                is_authenticated;
            if(id){
                is_authenticated = true;
            }
            window.currentuser.set({
                id: id, username: username, email: email, 
                notifications: notifications, avatar: avatar,
                is_authenticated: is_authenticated
            });
            this.topiccollection = new TopicCollection();
            this.topic = new Topic();
        },

        index: function () {
            this.utils({active: 'home'});
            this.topiccollection.url = '/api/topics/';
            this.mainview = new TopicListView({collection: this.topiccollection, add: true});
            $(".clearfix").html(this.mainview.render().el);
            var sidebarview = new SideBarView();
            $('#sidebar').html(sidebarview.render().el);
        },

        usertopics: function (id) {
            this.utils({active: ''});
            this.topiccollection.url = '/api/users/'+id+'/topics';
            this.mainview = new TopicListView({collection: this.topiccollection});
            $(".clearfix").html(this.mainview.render().el);
            var sidebarview = new SideBarView({author: id});
            $('#sidebar').html(sidebarview.render().el);
        },

        about: function() {
            this.utils({active: 'about'});
            this.mainview = new AboutView();
            $(".clearfix").html(this.mainview.render().el);
            var sidebarview = new SideBarView();
            $('#sidebar').html(sidebarview.render().el);
        },

        contact: function() {
            this.utils({active: 'contact'});
            this.mainview = new ContactView();
            $(".clearfix").html(this.mainview.render().el);
            var sidebarview = new SideBarView();
            $('#sidebar').html(sidebarview.render().el);
        },

        sigin: function() {
            if(window.currentuser.get('username')){
                Backbone.history.navigate("", {trigger: true, replace: true});
                return;
            }
            this.utils({active: ''});
            this.mainview = new SigninView();
            $('.nosidebar').html(this.mainview.render().el);
        },

        sigup: function() {
            if(window.currentuser.get('username')){
                Backbone.history.navigate("", {trigger: true, replace: true});
                return;
            }
            this.utils({active: ''});
            this.mainview = new SignupView();
            $('.nosidebar').html(this.mainview.render().el);
        },

        detail: function(id) {
            this.utils({active: ''});
            this.topic.set("id", id);
            this.topic.fetch();
            this.mainview = new TopicView({ model: this.topic, detail: true });
            $(".clearfix").html(this.mainview.render().el);
            var sidebarview = new SideBarView({topic: id});
            $('#sidebar').html(sidebarview.render().el);
        },
        
        search: function(keyword) {
            this.utils({active: ''});
            this.topiccollection.url = '/api/topics/?keyword='+keyword;
            this.mainview = new TopicListView({collection: this.topiccollection});
            $(".clearfix").html(this.mainview.render().el);
            $('.nav .active').removeClass('active');
            var sidebarview = new SideBarView();
            $('#sidebar').html(sidebarview.render().el);
        },

        myfollowing: function() {
            this.utils({active: ''});
            this.friendcollection = new UserCollection();
            this.mainview = new FollowingListView({collection: this.friendcollection});
            $(".clearfix").html(this.mainview.render().el);
            var sidebarview = new SideBarView();
            $('#sidebar').html(sidebarview.render().el);
        },

        myfans: function() {
            this.utils({active: ''});
            this.friendcollection = new UserCollection();
            this.friendcollection.url = '/api/myfans/'
            this.mainview = new FollowingListView({collection: this.friendcollection});
            $(".clearfix").html(this.mainview.render().el);
            var sidebarview = new SideBarView();
            $('#sidebar').html(sidebarview.render().el);
        },

        nofound: function(path) {
            this.utils({active: ''});
            var nofoundview = new NoFoundView();
            $('.nosidebar').html(nofoundview.render().el);
            $('.nav .active').removeClass('active');
        },

        profile: function() {
            if(!window.currentuser.get('username')){
                Backbone.history.navigate("signin", {trigger: true, replace: true});
                return;
            }
            this.utils({active: ''});
            this.mainview = new ProfileView();
            $(".clearfix").html(this.mainview.render().el);
            this.sidebarview = new SideBarView();
            $('#sidebar').html(this.sidebarview.render().el);
        },

        passwordchange: function() {
            if(!window.currentuser.get('username')){
                Backbone.history.navigate("signin", {trigger: true, replace: true});
                return;
            }
            this.utils({active: ''});
            this.mainview = new PasswordChangeView();
            $('.nosidebar').html(this.mainview.render().el);
        },

        passwordreset: function() {
            if(window.currentuser.get('username')){
                Backbone.history.navigate("", {trigger: true, replace: true});
                return;
            }
            this.utils({active: ''});
            this.mainview = new PasswordResetView();
            $('.nosidebar').html(this.mainview.render().el);
        },

        utils: function(options){
            $('.nosidebar').html('');
            $(".clearfix").html('');
            $('#sidebar').html('');
            this.navbarview = new NavBarView({active: options.active});
            $('.navbar-collapse.collapse').html(this.navbarview.render().el);
        }
    });

    return Router;
});