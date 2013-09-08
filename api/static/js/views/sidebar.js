/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'models/user',
	'views/simpletopiclist',
	'views/hottopiclist',
	'text!templates/usersidebar.html',
	'text!templates/aboutsidebar.html',
	'jquery.bootstrap'
], function (
	$, 
	_, 
	underi18n,
	Backbone, 
	zh_CN,
	model,
	SimpleTopicListView,
	HotTopicListView,
	usersidebarTemplate,
	aboutsidebarTemplate) {
	'use strict';

	var SideBarView = Backbone.View.extend({

		// usertemplate: _.template(usersidebarTemplate),
		// aboutsidebartemplate: _.template(aboutsidebarTemplate),

		initialize: function (options) {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.usertemplate = _.template(underi18n.template(usersidebarTemplate, locale));
			this.aboutsidebartemplate = _.template(underi18n.template(aboutsidebarTemplate, locale));
			this.options = options;
			if(options && options.topic){
				this.model = new model();
				this.model.url = '/api/users/' + options.topic;
				this.model.fetch();
				this.simpletopiclist = new SimpleTopicListView(options);
				this.listenTo(this.model, 'change', this.render);
			} else {
				this.hottopiclist = new HotTopicListView();
			}

			_.bindAll(this, 'render');
		},

		events: {
			"click .list-group-item": "usertopics",
			
		},

		render: function () {
			this.$el.html('');
			if(this.options && this.options.topic){
				this.$el.prepend(this.usertemplate(this.model.toJSON()));
				this.$el.append(this.simpletopiclist.render().el);
			} else {
				this.$el.prepend(this.aboutsidebartemplate());
				this.$el.append(this.hottopiclist.render().el);
			}
			return this;
		},

		usertopics: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate("user/"+this.model.id, {trigger: true, replace: true});
		},
	});

	return SideBarView;
});
