/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'text!templates/signup.html',
	'jquery.spin'
], function ($, _, underi18n, Backbone, zh_CN, signupTemplate) {
	'use strict';

	var SignUpView = Backbone.View.extend({

		tagName:  'div',
		className: "clearfix",

		// template: _.template(signupTemplate),
		
		events: {
            "click .signup":                        "signup",
            "keypress input[name=username]":		"keypresssignin",
            "keypress input[name=email]":		    "keypresssignin",
            "keypress input[name=password1]":		"keypresssignin",
            "keypress input[name=password2]":		"keypresssignin",
		},

		initialize: function (options) {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(signupTemplate, locale));
		
        	_.bindAll(this, 'render', 'signup', 'keypresssignin');
		},

		render: function () {
		    this.$el.html(this.template);
		    return this;
		},

		signup: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();

            var username = this.$el.find('input[name=username]').val().trim(),
                email = this.$el.find('input[name=email]').val().trim(),
        		password1 = this.$el.find('input[name=password1]').val().trim(),
        		password2 = this.$el.find('input[name=password2]').val().trim(),
        		self = this,
        		csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');

        	if(!username){
        		this.$el.find('input[name=username]').focus().closest('.form-group').addClass('has-error');
        		return;
        	}
        	if(!email){
        		this.$el.find('input[name=email]').focus().closest('.form-group').addClass('has-error');
        		return;
        	}
        	if(!password1){
        		this.$el.find('input[name=password1]').focus().closest('.form-group').addClass('has-error');
        		return;
        	}
        	if(password1.length < 6){
        		this.$el.find('input[name=password1]').focus().closest('.form-group').addClass('has-error');
        		return;
        	}
        	if(!password2){
        		this.$el.find('input[name=password2]').focus().closest('.form-group').addClass('has-error');
        		return;
        	}
        	if(password2.length < 6){
        		this.$el.find('input[name=password2]').focus().closest('.form-group').addClass('has-error');
        		return;
        	}
        	if(password1 != password2){
        		this.$el.find('input[name=password1]').closest('.form-group').addClass('has-error');
        		this.$el.find('input[name=password2]').closest('.form-group').addClass('has-error');
        		return;
        	}

        	if(username && password1 && password2){
	        	$.ajax({
		            type: 'POST',
		            url: '/accounts/register/',
		            dataType: 'html',
		            data: { username: username, email: email, password1: password1, password2: password2, csrfmiddlewaretoken: csrfmiddlewaretoken },
		        }).done(function(data){
		        	if(data === 'done'){
		        		window.currentuser.set(data);
		        		Backbone.history.navigate("", {trigger: true, replace: true});
		        	} else {
		        		self.$el.find('.signup-placeholder').html(data);
		        	}
		        }).fail(function(jqXHR, textStatus){
		        	console.log( "Request failed: " + textStatus );
		        });
        	}
		},

		keypresssignin: function(e) {
            if (e.which !== 13) {
				return;
			}
        	this.signup(e);
		},
	});

	return SignUpView;
});
