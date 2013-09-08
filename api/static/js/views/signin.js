/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'models/simpleuser',
	'text!templates/signin.html',
	'jquery.spin'
], function ($, _, underi18n, Backbone, zh_CN, SimpleUserModel, signinTemplate) {
	'use strict';

	var SigninView = Backbone.View.extend({

		tagName:  'div',
		className: "clearfix",

		// template: _.template(signinTemplate),
		
		events: {
            "click .signin": "signin",
            "keypress input[name=username]":		"keypresssignin",
            "keypress input[name=password]":		"keypresssignin",
		},

		initialize: function (options) {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(signinTemplate, locale));
        	_.bindAll(this, 'render', 'signin', 'keypresssignin');
		},

		render: function () {
		    this.$el.html(this.template);
		    return this;
		},

		signin: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();

            var username = this.$el.find('input[name=username]').val().trim(),
        		password = this.$el.find('input[name=password]').val().trim(),
        		self = this,
        		csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');

        	if(!username){
        		this.$el.find('input[name=username]').focus().closest('.form-group').addClass('has-error');
        	}
        	if(!password){
        		this.$el.find('input[name=password]').focus().closest('.form-group').addClass('has-error');
        	}

        	if(username && password){
	        	$.ajax({
		            type: 'POST',
		            url: '/api/users/auth',
		            dataType: 'json',
		            data: { username: username, password: password, csrfmiddlewaretoken: csrfmiddlewaretoken },
		        }).done(function(data){
		        	if(data.error){
		        		self.$el.find('.form-group').addClass('has-error');
		        		self.$el.find('.control-label').removeClass('hide');
		        	} else {
		        		window.currentuser.set(data);
		        		Backbone.history.navigate('', {trigger: true, replace: true});
		        	}
		        });
        	}
		},

		keypresssignin: function(e) {
            if (e.which !== 13) {
				return;
			}
        	this.signin(e);
		},
	});

	return SigninView;
});
