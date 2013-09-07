/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'text!templates/404.html'
], function ($, _, underi18n, Backbone, zh_CN, nofoundTemplate) {
	'use strict';

	var NoFoundView = Backbone.View.extend({

		tagName:  'div',
		className: "clearfix",

		// template: _.template(nofoundTemplate),
		
		events: {
            "click .home":   "home",
		},

		initialize: function () {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(nofoundTemplate, locale));
		
        	_.bindAll(this, 'render');
		},

		render: function () {
		    this.$el.html(this.template);
		    return this;
		},

		home: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
			Backbone.history.navigate("", {trigger: true, replace: true});
		},
	});

	return NoFoundView;
});
