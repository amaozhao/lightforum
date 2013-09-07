/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'text!templates/friend.html',
	'jquery.bootstrap'
], function ($, _, underi18n, Backbone, zh_CN, friendTemplate) {
	'use strict';

	var FriendView = Backbone.View.extend({

		// template: _.template(friendTemplate),

		events: {
			"mouseenter .user-img > img": "popover",
			"mouseleave .col-lg-2": "hidepopover",
			"click .user-img": "usertopic",
			"click .btn-sm": "friendaction",
		},

		initialize: function (options) {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(friendTemplate, locale));
		
			this.options = options;
			this.listenTo(this.model, 'change', this.render);
			_.bindAll(this, 'render');
		},

		render: function () {
			this.$el.html('');
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		popover: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.user-img').popover("show", 
                {
                	html: true,
        		}
            );
            this.$el.find('.popover-title').addClass('text-center')
		},
		hidepopover: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.user-img').popover('hide');
		},

		usertopic: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate("user/"+this.model.id, {trigger: true, replace: true});
		},

		friendaction: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            var to_user = this.model.id,
            	csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');
            	self = this;
            $.ajax({
            	url: '/friends/action',
            	type: 'POST',
            	dataType: 'html',
            	data: {to_user: to_user, csrfmiddlewaretoken: csrfmiddlewaretoken},
            }).done(function() {
            	self.model.set('is_following', !self.model.get('is_following'));
            });
		},
	});

	return FriendView;
});
