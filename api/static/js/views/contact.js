/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'text!templates/contact.html',
	'jquery.spin'
], function ($, _, underi18n, Backbone, zh_CN, contactTemplate) {
	'use strict';

	var ContactView = Backbone.View.extend({

		tagName:  'div',
		className: "clearfix",

		// template: _.template(contactTemplate),
		
		initialize: function () {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(contactTemplate, locale));
			
        	_.bindAll(this, 'render');
		},

		render: function () {
		    this.$el.html(this.template);
		    return this;
		},
	});

	return ContactView;
});
