/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'text!templates/topic.html',
	'views/commentlist',
	'views/popoveruser',
	'models/user',
	'i18n/zh-cn',
	'text!templates/addcomment.html',
	'gfm',
	'jquery.bootstrap'
], function ($, _, underi18n, Backbone, topicTemplate, CommentListView, PopoverUserView, UserModel, zh_CN, addcommentTemplate, GFM) {
	'use strict';

	var TopicView = Backbone.View.extend({

		// template: _.template(topicTemplate),
		// addcommenttemplate: _.template(addcommentTemplate),

		events: {
			"mouseenter .topic-title": "display",
			"mouseleave .topic-title": "hide",
			"mouseenter .user-img > img": "popover",
			"click .user-img": "usertopic",
			"mouseleave .topic": "hidepopover",
            "click .edit-topic": "edit",
            "click .cancel":   "cancel",
            "click .topic-detail": "detail",
            "click .save": "save",
            "click .friend": "addfriend",
            "click .comment-placeholder": "displaycommentform",
            "click .add-comment-cancel":   "cancelcommentform",
            "click .add-comment-save": "savecommentform"
		},

		initialize: function (options) {
			var zh = zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(topicTemplate, locale));
			this.addcommenttemplate = _.template(underi18n.template(addcommentTemplate, locale));
		
			this.options = options;

			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'add', this.render);
			_.bindAll(this, 'render', 'edit', 'cancel', 'detail', 'save', 'displaycommentform', 'cancelcommentform', 'savecommentform');
			if(this.options.detail){
				this.commentlistview = new CommentListView({url: '/api/comments/'+this.model.id});
				this.listenTo(this.commentlistview.collection, 'add', this.render);
				this.listenTo(this.commentlistview.collection, 'reset', this.render);
			}
		},

		render: function () {
			this.$el.html('');
			this.$el.html(this.template(this.model.toJSON()));
			if(this.options.detail){
				this.$el.find('.content').html(this.model.get('markdown'));
				var commentsize = _.size(this.commentlistview.collection),
					commentable = this.model.get('commentable');
				if(commentsize || commentable){
					this.$el.find('.panel-footer').removeClass('hide');
				}
				this.$el.find('.panel-footer').html(this.commentlistview.render().el);
				this.$el.find('.panel-footer').append(this.addcommenttemplate(this.model.toJSON()));
			} else {
				this.$el.find('.panel-footer').html('');
				this.$el.find('.content').html(this.model.get('cut_markdown'));
				this.$el.find('.panel-footer').addClass('hide');
			}
			return this;
		},

		display: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.edit-topic').removeClass('hide');
		},
		hide: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.edit-topic').addClass('hide');
		},

		popover: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.user-img').popover("show", 
                {
                	html: true,
        		}
            );
            this.$el.find('.popover-title').addClass('text-center');
		},
		hidepopover: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.user-img').popover('hide');
		},

		usertopic: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate("user/"+this.model.get('author_id'), {trigger: true, replace: true});
		},

		edit: function(e){
            var self = this;
            this.$el.find('.content').addClass('hide');
            this.$el.find('.title').addClass('hide');
            this.$el.find('.edit').removeClass('hide');
            this.$el.find('.title-input').removeClass('hide');
            this.$el.find("#topic-editor-"+ this.model.id).val(this.model.get('content'));
            var editor = CodeMirror.fromTextArea(document.getElementById("topic-editor-"+ this.model.id), {
		        mode: 'gfm',
		        lineNumbers: false,
		        theme: "default"
	      	});
	      	editor.on("change", function() {
	            $('#topic-editor-'+ self.model.id).val(editor.getValue());
	        });
	        editor.on("focus", function() {
	        	self.$el.find('.CodeMirror').addClass('focusedCodeMirror');
	        });
	        editor.on("blur", function() {
	        	self.$el.find('.CodeMirror').removeClass('focusedCodeMirror');
	        });
		},

		cancel: function(e) {
			this.$el.find('.content').removeClass('hide');
			this.$el.find('.title').removeClass('hide');
            this.$el.find('.edit').addClass('hide');
            this.$el.find('.title-input').addClass('hide');
            this.$el.find("#topic-editor-"+ this.model.id).val('');
            this.$el.find('.CodeMirror').remove();
		},

		displaycommentform: function(e){
            var self = this;
            this.$el.find('.comment-placeholder').addClass('hide');
            this.$el.find('.comment-add').removeClass('hide');
            var editor = CodeMirror.fromTextArea(document.getElementById("new-comment"), {
		        mode: 'gfm',
		        lineNumbers: false,
		        theme: "default"
	      	});
	      	editor.on("change", function() {
	            $('#new-comment').val(editor.getValue());
	        });
	        editor.on("focus", function() {
	        	self.$el.find('.CodeMirror').addClass('focusedCodeMirror');
	        });
	        editor.on("blur", function() {
	        	self.$el.find('.CodeMirror').removeClass('focusedCodeMirror');
	        });
		},

		cancelcommentform: function(e) {
			this.$el.find('.comment-placeholder').removeClass('hide');
            this.$el.find('.comment-add').addClass('hide');
            this.$el.find('.addcomment .CodeMirror').remove();
		},
		
		savecommentform: function(e){
		    e.stopImmediatePropagation();
            e.preventDefault();
            var content = this.$el.find('#new-comment').val();
            if(content){
                this.commentlistview.collection.create({ content: content });
	            this.$el.find('.comment-placeholder').removeClass('hide');
	            this.$el.find('.comment-add').addClass('hide');
	            this.$el.find('.addcomment .CodeMirror').remove();
            }
		},
		
		detail: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            Backbone.history.navigate('topic/' + this.model.id, {trigger: true, replace: true});
		},

		save: function(e){
		    e.stopImmediatePropagation();
            e.preventDefault();
            var title = this.$el.find('.title-input').val().trim(),
                content = this.$el.find('#topic-editor-'+this.model.id).val();
            if(title && content){
                this.model.save({ title: title, content: content });
            	this.$el.find('.CodeMirror').remove();
            	this.$el.find('.panel-footer').html('');
            }
		},

		addfriend: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            var to_user = this.model.get('author_id'),
            	following = this.model.get('following'),
            	csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');
            	self = this;
            $.ajax({
            	url: '/friends/action',
            	type: 'POST',
            	dataType: 'html',
            	data: {to_user: to_user, csrfmiddlewaretoken: csrfmiddlewaretoken},
            }).done(function() {
            	self.model.set('following', !following);
            });
		}

	});

	return TopicView;
});
