/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/popoveruser.html'
], function ($, _, Backbone, popoveruserTemplate) {
	'use strict';

	var PopoverUserView = Backbone.View.extend({
		tpl: _.template(popoveruserTemplate),
		
		initialize: function () {
			// this.model.fetch();
			this.listenTo(this.model, 'change', this.render);
        	_.bindAll(this, 'render');
		},

		render: function () {
			this.$el.html('');
			this.$el.html(this.tpl(this.model.toJSON()));
		    return this;
		},
	});

	return PopoverUserView;
});