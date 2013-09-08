/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
    'i18n/zh-cn',
	'collections/topic',
    'models/simpleuser',
	'views/topic',
    'text!templates/addtopic.html',
	'jquery.bootstrap',
	'jquery.spin'
], function ($, _, underi18n, Backbone, zh_CN, TopicCollection, SimpleUserModel, TopicView, addtopicTemplate) {
	'use strict';

	var TopicListView = Backbone.View.extend({

        // addtopictemplate: _.template(addtopicTemplate),
		
		className: "topic-list",

		events: {
            "blur .addtopic .title-input": "notnone",
            "click .topic-placeholder":    "edit",
            "click .add-topic-cancel":     "cancel",
            "click .add-topic-save":       "save"
		},

		initialize: function (options) {
            var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.addtopictemplate = _.template(underi18n.template(addtopicTemplate, locale));
            this.options = options;
            if(options && options.user){
                this.usermodel = options.user;
                this.listenTo(window.currentuser, 'change', this.render);
            }
            this.collection.fetch({reset: true});
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'reset', this.render);
        },

        render: function () {
            this.$el.html('');
            this.$el.html(this.addAll());
            if(this.options && this.options.user){
                this.$el.prepend(this.addtopictemplate(this.usermodel.toJSON()));
            }
            var self = this;
            $(window).scroll(function() { self.scroll(); });
            $('#spin').spin('tiny', 'teal');
		    return this;
		},

        addNew: function() {
            this.$el.prepend(this.addtopictemplate(this.usermodel.toJSON()));
        },

		addOne: function (topic) {
			var view = new TopicView({ model: topic });
			this.$el.append(view.render().el);
		},

		addAll: function () {
			this.collection.each(this.addOne, this);
		},

        notnone: function(e) {
            var title = this.$el.find('.addtopic .title-input').val().trim();
            if(title) {
                this.$el.find('.addtopic .title-input').closest('.form-group').removeClass('has-error');
            } else {
                this.$el.find('.addtopic .title-input').closest('.form-group').addClass('has-error');
            }
        },

        edit: function(e){
            var self = this;
            this.$el.find('.addtopic .topic-placeholder').addClass('hide');
            this.$el.find('.addtopic .topic-title').removeClass('hide');
            this.$el.find('.addtopic .topic-add').removeClass('hide');
            var editor = CodeMirror.fromTextArea(document.getElementById("new-topic"), {
                mode: 'gfm',
                lineNumbers: false,
                theme: "default"
            });
            editor.on("change", function() {
                $('#new-topic').val(editor.getValue());
            });
            editor.on("focus", function() {
                self.$el.find('.CodeMirror').addClass('focusedCodeMirror');
            });
            editor.on("blur", function() {
                self.$el.find('.CodeMirror').removeClass('focusedCodeMirror');
            });
        },

        cancel: function(e) {
            this.$el.find('.addtopic .topic-title').addClass('hide');
            this.$el.find('.addtopic .topic-add').addClass('hide');
            this.$el.find('.addtopic .CodeMirror').remove();
            this.$el.find('.addtopic .topic-placeholder').removeClass('hide');
        },

        save: function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            this.stopListening(this.collection, 'add');
            var title = this.$el.find('.addtopic .title-input').val().trim(),
                content = this.$el.find('#new-topic').val();
            if(title && content){
                var newtopic = this.collection.create({ title: title, content: content }, {wait: true});
                var view = new TopicView({ model: newtopic });
                this.$el.find('.addtopic').next().prepend(view.render().el);
                this.$el.find('.addtopic .topic-placeholder').removeClass('hide');
                this.$el.find('.addtopic .topic-title').addClass('hide');
                this.$el.find('.addtopic .topic-add').addClass('hide');
                this.$el.find('.addtopic .CodeMirror').remove();
                this.$el.find('.addtopic .title-input').val('');
                this.$el.find('#new-topic').val('');
            }
            this.listenTo(this.collection, 'add', this.render);
        },
		
		scroll: function() {
            var bottom = $(document).height() - $(window).height() - 50 <= $(window).scrollTop();
            var self = this;
            if (bottom && self.collection.next) {
                $(window).unbind('scroll');
                self.$el.ajaxStart(function(){
                    $('#spin').removeClass('hide').spin('tiny', 'teal');
                });
                
                self.$el.ajaxStop(function(){
                    $('#spin').addClass('hide').spin(false);
                });
                
                $.getJSON(self.collection.next, function(data) {
                    self.collection.add(data.results);
                    if(data.next){
                        self.collection.next = data.next;
                    } else {
                        self.collection.next = null;
                    }
                    $(window).scroll(function() { self.scroll(); });
                });
            }
        },
	});

	return TopicListView;
});
