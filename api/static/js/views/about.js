/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'text!templates/about.html',
	'jquery.spin'
], function ($, _, underi18n, Backbone, zh_CN, aboutTemplate) {
	'use strict';

	var AboutView = Backbone.View.extend({

		tagName:  'div',
		className: "clearfix",

		// template: _.template(aboutTemplate),
		
		initialize: function () {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(aboutTemplate, locale));
		
        	_.bindAll(this, 'render');
		},

		render: function () {
		    this.$el.html(this.template);
		    
		    return this;
		},
	});

	return AboutView;
});
