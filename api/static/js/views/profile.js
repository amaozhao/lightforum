/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'models/profile',
	'text!templates/profile.html',
	'jquery.spin'
], function ($, _, underi18n, Backbone, zh_CN, ProfileModel, profileTemplate) {
	'use strict';

	var ProfileView = Backbone.View.extend({

		tagName:  'div',
		className: "clearfix",

		// template: _.template(aboutTemplate),

		events: {
            "click .save-profile": "save",
		},
		
		initialize: function () {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(profileTemplate, locale));

			this.model = new ProfileModel();
			this.model.fetch();
			this.listenTo(this.model, 'change', this.render);
        	_.bindAll(this, 'render');
		},

		render: function () {
			this.$el.html('');
		    this.$el.html(this.template(this.model.toJSON()));
		    
		    return this;
		},

		save: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();

            var gender = this.$el.find('select').val(),
            	qq = this.$el.find('input[name=qq]').val().trim(),
        		weibo = this.$el.find('input[name=weibo]').val().trim();
        	this.model.save({ gender: gender, qq: qq, weibo: weibo });
		},
	});

	return ProfileView;
});
